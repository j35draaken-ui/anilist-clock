<?php
declare(strict_types=1);

const THEMES = [
    'dark' => ['digits' => '#e7f5f7', 'seconds' => '#55d6e8', 'colon' => '#668493', 'label' => '#9cb4bb', 'panel' => '#081820'],
    'light' => ['digits' => '#25313c', 'seconds' => '#187f9a', 'colon' => '#8293a0', 'label' => '#5e6d77', 'panel' => '#f4f8f7'],
];
const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function escape_xml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
}

function normalize_flag(string $value): string
{
    $flag = strtolower(trim($value));
    return preg_match('/^[a-z]{2}(?:-[a-z]{3})?$/D', $flag) === 1 ? $flag : '';
}

function normalize_label(string $value): string
{
    $label = trim($value);
    if (preg_match_all('/./us', $label, $matches) === false) {
        return '';
    }

    $characters = [];
    $utf16_length = 0;
    foreach ($matches[0] as $character) {
        $units = strlen($character) === 4 ? 2 : 1;
        if ($utf16_length + $units > 28) {
            break;
        }
        $characters[] = $character;
        $utf16_length += $units;
    }
    return implode('', $characters);
}

function normalize_color(mixed $value, string $fallback): string
{
    return is_string($value) && preg_match('/^#[a-f0-9]{6}$/iD', $value) === 1 ? $value : $fallback;
}

function solar_position(int $timestamp): array
{
    $julian_date = $timestamp / 86400 + 2440587.5;
    $century = ($julian_date - 2451545) / 36525;
    $mean_longitude = fmod(280.46646 + $century * (36000.76983 + 0.0003032 * $century), 360);
    if ($mean_longitude < 0) {
        $mean_longitude += 360;
    }
    $mean_anomaly = deg2rad(fmod(357.52911 + $century * (35999.05029 - 0.0001537 * $century), 360));
    $equation_of_center = (1.914602 - $century * (0.004817 + 0.000014 * $century)) * sin($mean_anomaly)
        + (0.019993 - 0.000101 * $century) * sin(2 * $mean_anomaly)
        + 0.000289 * sin(3 * $mean_anomaly);
    $omega = deg2rad(125.04 - 1934.136 * $century);
    $lambda = deg2rad($mean_longitude + $equation_of_center - 0.00569 - 0.00478 * sin($omega));
    $obliquity = deg2rad(23.439291 - 0.0130042 * $century + 0.00256 * cos($omega));
    $declination = rad2deg(asin(sin($obliquity) * sin($lambda)));
    $mean_longitude_radians = deg2rad($mean_longitude);
    $eccentricity = 0.016708634 - $century * (0.000042037 + 0.0000001267 * $century);
    $y = tan($obliquity / 2) ** 2;
    $equation_of_time = 4 * rad2deg(
        $y * sin(2 * $mean_longitude_radians)
        - 2 * $eccentricity * sin($mean_anomaly)
        + 4 * $eccentricity * $y * sin($mean_anomaly) * cos(2 * $mean_longitude_radians)
        - 0.5 * $y * $y * sin(4 * $mean_longitude_radians)
        - 1.25 * $eccentricity * $eccentricity * sin(2 * $mean_anomaly)
    );
    $utc_hours = (int) gmdate('G', $timestamp) + (int) gmdate('i', $timestamp) / 60 + (int) gmdate('s', $timestamp) / 3600;
    $subsolar_longitude = fmod(180 - 15 * $utc_hours - $equation_of_time / 4 + 180, 360);
    if ($subsolar_longitude < 0) {
        $subsolar_longitude += 360;
    }
    $subsolar_longitude -= 180;

    return ['declination' => $declination, 'longitude' => $subsolar_longitude];
}

function twilight_paths(int $timestamp): array
{
    $width = 480;
    $height = 240;
    $solar = solar_position($timestamp);
    $declination = deg2rad($solar['declination']);
    $sin_declination = sin($declination);
    $cos_declination = cos($declination);
    $thresholds = [0, -6, -12, -18];
    foreach ($thresholds as &$threshold) {
        $threshold = sin(deg2rad($threshold));
    }
    unset($threshold);
    $paths = ['', '', '', ''];

    for ($x = 0; $x < $width; $x += 4) {
        $longitude = -180 + (($x + 2) * 360 / $width);
        $hour_angle = deg2rad($longitude - $solar['longitude']);
        $cos_hour_angle = cos($hour_angle);
        $current_state = -1;
        $run_start = 0;

        for ($y = 0; $y <= $height; $y += 2) {
            $state = -1;
            if ($y < $height) {
                $latitude = deg2rad(90 - (($y + 1) * 180 / $height));
                $solar_altitude = sin($latitude) * $sin_declination
                    + cos($latitude) * $cos_declination * $cos_hour_angle;
                $state = $solar_altitude >= $thresholds[0] ? 0
                    : ($solar_altitude >= $thresholds[1] ? 1
                        : ($solar_altitude >= $thresholds[2] ? 2
                            : ($solar_altitude >= $thresholds[3] ? 3 : 4)));
            }
            if ($state !== $current_state) {
                if ($current_state > 0) {
                    $run_height = $y - $run_start;
                    $paths[$current_state - 1] .= 'M' . $x . ' ' . $run_start . 'h4v' . $run_height . 'h-4z';
                }
                $current_state = $state;
                $run_start = $y;
            }
        }
    }

    return ['paths' => $paths, ...$solar];
}

function location_map(float $x, float $latitude, float $longitude, bool $coordinates_provided, string $marker_color, int $marker_size, float $night_strength, string $map_data, int $now): string
{
    $frame_seconds = 600;
    $frame_count = 18;
    $duration = $frame_seconds * $frame_count;
    $start = intdiv($now, $frame_seconds) * $frame_seconds;
    $frames = [];
    for ($index = 0; $index < $frame_count; $index++) {
        $frames[] = twilight_paths($start + $index * $frame_seconds);
    }
    $opacities = [];
    foreach ([0.42, 0.58, 0.74, 0.88] as $opacity) {
        $opacities[] = min(0.9, $opacity * $night_strength);
    }
    $shading = '';
    foreach ($frames[0]['paths'] as $index => $path) {
        $path_values = implode(';', array_column(array_column($frames, 'paths'), $index));
        $shading .= '<path d="' . $path . '" fill="#000008" fill-opacity="' . number_format($opacities[$index], 3, '.', '') . '"><animate attributeName="d" values="' . $path_values . '" dur="' . $duration . 's" calcMode="discrete" repeatCount="indefinite"/></path>';
    }

    $sun_x = $sun_y = [];
    foreach ($frames as $frame) {
        $sun_x[] = number_format(($frame['longitude'] + 180) / 360 * 479, 2, '.', '');
        $sun_y[] = number_format((90 - $frame['declination']) / 180 * 239, 2, '.', '');
    }
    $sun_x_values = implode(';', $sun_x);
    $sun_y_values = implode(';', $sun_y);
    $sun = '<g aria-label="Moving sun marker"><circle cx="' . $sun_x[0] . '" cy="' . $sun_y[0] . '" r="6.5" fill="none" stroke="#ffffff" stroke-width="1.5"><animate attributeName="cx" values="' . $sun_x_values . '" dur="' . $duration . 's" calcMode="discrete" repeatCount="indefinite"/><animate attributeName="cy" values="' . $sun_y_values . '" dur="' . $duration . 's" calcMode="discrete" repeatCount="indefinite"/></circle><circle cx="' . $sun_x[0] . '" cy="' . $sun_y[0] . '" r="3.5" fill="#ffcd32"><animate attributeName="cx" values="' . $sun_x_values . '" dur="' . $duration . 's" calcMode="discrete" repeatCount="indefinite"/><animate attributeName="cy" values="' . $sun_y_values . '" dur="' . $duration . 's" calcMode="discrete" repeatCount="indefinite"/></circle></g>';
    $marker = '';
    if ($coordinates_provided) {
        $marker_x = max(5, min(475, (($longitude + 180) / 360) * 479));
        $marker_y = max(5, min(235, ((90 - $latitude) / 180) * 239));
        $marker_x = number_format($marker_x, 2, '.', '');
        $marker_y = number_format($marker_y, 2, '.', '');
        $marker = '<circle cx="' . $marker_x . '" cy="' . $marker_y . '" r="' . ($marker_size + 4) . '" fill="' . $marker_color . '" fill-opacity=".3"/><circle cx="' . $marker_x . '" cy="' . $marker_y . '" r="' . $marker_size . '" fill="' . $marker_color . '" stroke="#ffffff" stroke-width="2"/>';
    }

    $utc_labels = '';
    for ($index = 0; $index < $frame_count; $index++) {
        $frame_opacities = array_fill(0, $frame_count, '0');
        $frame_opacities[$index] = '1';
        $label = 'UTC ' . gmdate('H:i', $start + $index * $frame_seconds);
        $utc_labels .= '<text x="465" y="18" text-anchor="end" font-family="sans-serif" font-size="10" fill="#ffffff" opacity="0">' . $label . '<animate attributeName="opacity" values="' . implode(';', $frame_opacities) . '" dur="' . $duration . 's" calcMode="discrete" repeatCount="indefinite"/></text>';
    }

    return '<svg x="' . $x . '" y="0" width="240" height="120" viewBox="0 0 480 240" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="mapClip"><rect width="480" height="240" rx="6"/></clipPath></defs><g clip-path="url(#mapClip)"><image width="480" height="240" href="data:image/jpeg;base64,' . $map_data . '"/>' . $shading . $sun . $marker . '<rect x="405" y="5" width="70" height="18" rx="3" fill="#000000" fill-opacity=".45"/>' . $utc_labels . '</g></svg>';
}

function is_daylight(DateTimeImmutable $now, float $latitude, float $longitude): bool
{
    $utc = $now->setTimezone(new DateTimeZone('UTC'));
    $day_of_year = (int) $utc->format('z') + 1;
    $utc_hour = (int) $utc->format('G') + (int) $utc->format('i') / 60 + (int) $utc->format('s') / 3600;
    $gamma = (2 * M_PI / 365) * ($day_of_year - 1 + ($utc_hour - 12) / 24);
    $equation_of_time = 229.18 * (0.000075 + 0.001868 * cos($gamma)
        - 0.032077 * sin($gamma) - 0.014615 * cos(2 * $gamma)
        - 0.040849 * sin(2 * $gamma));
    $declination = 0.006918 - 0.399912 * cos($gamma) + 0.070257 * sin($gamma)
        - 0.006758 * cos(2 * $gamma) + 0.000907 * sin(2 * $gamma)
        - 0.002697 * cos(3 * $gamma) + 0.00148 * sin(3 * $gamma);
    $utc_minutes = (int) $utc->format('G') * 60 + (int) $utc->format('i') + (int) $utc->format('s') / 60;
    $solar_minutes = fmod($utc_minutes + $equation_of_time + 4 * $longitude, 1440);
    if ($solar_minutes < 0) {
        $solar_minutes += 1440;
    }
    $hour_angle = deg2rad($solar_minutes / 4 - 180);
    $latitude_radians = deg2rad($latitude);
    $cosine_zenith = sin($latitude_radians) * sin($declination)
        + cos($latitude_radians) * cos($declination) * cos($hour_angle);

    return $cosine_zenith >= cos(deg2rad(90.833));
}

function neutral_flag(): string
{
    return '<g aria-label="flag unavailable"><rect width="18" height="12" rx="1.5" fill="#1b3440"/><circle cx="9" cy="6" r="3.2" fill="none" stroke="#55d6e8" stroke-width="0.9"/><path d="M9 1.5v1.7M9 8.8v1.7M4.5 6h1.7M11.8 6h1.7" stroke="#55d6e8" stroke-width="0.8" stroke-linecap="round"/></g>';
}

function load_flag(string $code): array
{
    if ($code === '') {
        return ['markup' => '', 'found' => false];
    }

    $local_paths = [
        __DIR__ . '/flags/' . $code . '.svg',
        __DIR__ . '/../public/flags/' . $code . '.svg',
    ];
    $body = false;
    foreach ($local_paths as $local_path) {
        if (is_file($local_path)) {
            $body = file_get_contents($local_path);
            break;
        }
    }

    if (!is_string($body)) {
        return ['markup' => neutral_flag(), 'found' => false];
    }
    $encoded = base64_encode($body);
    return [
        'markup' => '<image href="data:image/svg+xml;base64,' . $encoded . '" width="18" height="12" preserveAspectRatio="none" clip-path="url(#flagCorners)"/>',
        'found' => true,
    ];
}

function strip_svg(int $x, array $digits, int $step, int $offset, string $color, int $width = 11, int $height = 22): string
{
    $rows = [];
    $texts = [];
    foreach ($digits as $index => $digit) {
        $rows[] = '0,' . (-$index * $height);
        $texts[] = '<text x="' . ($width / 2) . '" y="' . ($index * $height + 17) . '">' . $digit . '</text>';
    }

    return '<svg x="' . $x . '" y="4" width="' . $width . '" height="' . $height . '" overflow="hidden"><g fill="' . $color . '" text-anchor="middle">' . implode('', $texts) . '<animateTransform attributeName="transform" type="translate" calcMode="discrete" values="' . implode(';', $rows) . '" dur="' . (count($digits) * $step) . 's" begin="-' . $offset . 's" repeatCount="indefinite"/></g></svg>';
}

function colon_svg(int $x, string $color): string
{
    return '<text x="' . ($x + 3) . '" y="20" text-anchor="middle" fill="' . $color . '">:<animate attributeName="opacity" values="1;0.28" calcMode="discrete" dur="1s" repeatCount="indefinite"/></text>';
}

function meridiem_svg(int $x, int $seconds_of_day, string $color): string
{
    $animation = 'attributeName="opacity" calcMode="discrete" dur="86400s" begin="-' . $seconds_of_day . 's" repeatCount="indefinite"';
    return '<text x="' . ($x + 3) . '" y="19" font-size="8" fill="' . $color . '">AM<animate ' . $animation . ' values="1;0"/></text>'
        . '<text x="' . ($x + 3) . '" y="19" font-size="8" fill="' . $color . '">PM<animate ' . $animation . ' values="0;1"/></text>';
}

function render_clock(): string
{
    $requested_timezone = $_GET['tz'] ?? 'UTC';
    $requested_timezone = is_string($requested_timezone) ? $requested_timezone : 'UTC';
    $requested_timezone = $requested_timezone !== '' ? $requested_timezone : 'UTC';
    $requested_flag = $_GET['flag'] ?? '';
    $requested_flag = is_string($requested_flag) ? strtolower(trim($requested_flag)) : '';
    $flag = normalize_flag($requested_flag);
    $requested_label = $_GET['label'] ?? '';
    $label = normalize_label(is_string($requested_label) ? $requested_label : '');
    $theme = ($_GET['theme'] ?? '') === 'light' ? 'light' : 'dark';
    $colors = THEMES[$theme];
    $sun_enabled = ($_GET['sun'] ?? '') !== '0';
    $dot_color = normalize_color($_GET['dot'] ?? null, '#2bd576');
    $day_color = normalize_color($_GET['daycolor'] ?? null, '#f2c94c');
    $night_color = normalize_color($_GET['nightcolor'] ?? null, '#83aaff');
    $seconds_color = normalize_color($_GET['secondscolor'] ?? null, $colors['seconds']);
    $hour_format = ($_GET['format'] ?? '') === '12' ? '12' : '24';
    $map_enabled = ($_GET['map'] ?? '') !== '0';
    $map_marker_color = normalize_color($_GET['mapmarker'] ?? null, '#5ae682');
    $requested_marker_size = $_GET['mapdot'] ?? null;
    $map_marker_size = is_string($requested_marker_size) && preg_match('/^(?:[3-9]|1[0-2])$/D', $requested_marker_size) === 1
        ? (int) $requested_marker_size
        : 6;
    $requested_night_strength = $_GET['mapnight'] ?? null;
    $map_night_strength = is_string($requested_night_strength) && is_numeric($requested_night_strength)
        && (float) $requested_night_strength >= 0.6 && (float) $requested_night_strength <= 1.4
        ? (float) $requested_night_strength
        : 1.0;
    $latitude_value = $_GET['lat'] ?? null;
    $longitude_value = $_GET['lon'] ?? null;
    $coordinates_provided = is_string($latitude_value) && is_numeric($latitude_value)
        && is_string($longitude_value) && is_numeric($longitude_value)
        && is_finite((float) $latitude_value) && is_finite((float) $longitude_value)
        && (float) $latitude_value >= -90 && (float) $latitude_value <= 90
        && (float) $longitude_value >= -180 && (float) $longitude_value <= 180;

    $timezone = $requested_timezone;
    $timezone_warning = false;
    try {
        $now = new DateTimeImmutable('now', new DateTimeZone($timezone));
    } catch (Exception $error) {
        $timezone = 'UTC';
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $timezone_warning = true;
    }
    $hour = (int) $now->format('G');
    $minute = (int) $now->format('i');
    $second = (int) $now->format('s');

    $flag_data = $requested_flag !== '' && $flag === ''
        ? ['markup' => neutral_flag(), 'found' => false]
        : load_flag($flag);
    $flag_markup = $flag_data['markup'];
    $hours = [];
    for ($index = 0; $index < ($hour_format === '12' ? 12 : 24); $index++) {
        $hours[] = str_pad((string) ($hour_format === '12' ? $index + 1 : $index), 2, '0', STR_PAD_LEFT);
    }

    $parts = [];
    $x = $flag_markup !== '' ? 26 : 1;
    $seconds_of_day = $hour * 3600 + $minute * 60 + $second;
    $hours_offset = ($hour_format === '12' ? $hour % 12 : $hour) * 3600 + $minute * 60 + $second;
    $parts[] = strip_svg($x, array_map(static fn(string $value): string => $value[0], $hours), 3600, $hours_offset, $colors['digits']); $x += 11;
    $parts[] = strip_svg($x, array_map(static fn(string $value): string => $value[1], $hours), 3600, $hours_offset, $colors['digits']); $x += 11;
    $parts[] = colon_svg($x, $colors['colon']); $x += 6;
    $parts[] = strip_svg($x, str_split('012345'), 600, $minute * 60 + $second, $colors['digits']); $x += 11;
    $parts[] = strip_svg($x, str_split('0123456789'), 60, ($minute % 10) * 60 + $second, $colors['digits']); $x += 11;
    $parts[] = colon_svg($x, $colors['colon']); $x += 6;
    $parts[] = strip_svg($x, str_split('012345'), 10, $second, $seconds_color); $x += 11;
    $parts[] = strip_svg($x, str_split('0123456789'), 1, $second % 10, $seconds_color); $x += 11;
    if ($hour_format === '12') {
        $parts[] = meridiem_svg($x, $seconds_of_day, $colors['label']);
        $x += 20;
    }

    $warning_label = $timezone_warning
        ? ($label !== '' ? $label . ' · UTC' : 'UTC fallback')
        : (!$flag_data['found'] && $requested_flag !== '' ? 'flag unavailable' : '');
    $visible_label = $timezone_warning ? $warning_label : ($label !== '' ? $label : $warning_label);
    $label_x = $x + 8;
    $visible_characters = preg_match_all('/./us', $visible_label, $matches);
    $label_length = 0;
    if ($visible_characters !== false) {
        foreach ($matches[0] as $character) {
            $label_length += strlen($character) === 4 ? 2 : 1;
        }
    }
    $badge_x = $visible_label !== '' ? $label_x + $label_length * 6.6 + 9 : $x + 8;
    $daylight = $coordinates_provided
        ? is_daylight($now, (float) $latitude_value, (float) $longitude_value)
        : ($hour >= 6 && $hour < 18);
    $daylight_text = $daylight ? 'DAY' : 'NIGHT';
    $daylight_color = $daylight ? $day_color : $night_color;
    $badge_width = 48;
    $width = $sun_enabled
        ? (int) round($badge_x + $badge_width + 2)
        : (int) round($visible_label !== '' ? $label_x + $label_length * 6.6 + 2 : $x + 2);
    $daylight_description = $sun_enabled
        ? ' — ' . $daylight_text . ($coordinates_provided ? ' at selected coordinates' : ' (estimated from local time)')
        : '';
    $title = $timezone . ' clock' . ($visible_label !== '' ? ' — ' . $visible_label : '') . $daylight_description . ($map_enabled ? ' with animated day/night map' : '');
    $badge = $sun_enabled
        ? '<g aria-label="' . $daylight_text . ($coordinates_provided ? ', solar-calculated' : ', estimated from local time') . '"><rect x="' . $badge_x . '" y="5" width="' . $badge_width . '" height="20" rx="10" fill="' . $daylight_color . '" fill-opacity=".16"/><circle cx="' . ($badge_x + 8) . '" cy="15" r="2.5" fill="' . $dot_color . '"/><text x="' . ($badge_x + 14) . '" y="18" font-family="' . FONT . '" font-size="8" font-weight="600" fill="' . $daylight_color . '">' . $daylight_text . '</text></g>'
        : '';
    $map_x = max($width, $sun_enabled ? $badge_x + $badge_width + 2 : 0) + 10;
    $map_data = '';
    if ($map_enabled) {
        $map_path = __DIR__ . '/world.jpg';
        if (!is_file($map_path)) {
            $map_path = __DIR__ . '/../public/world.jpg';
        }
        $map_image = is_file($map_path) ? file_get_contents($map_path) : false;
        if (!is_string($map_image)) {
            throw new RuntimeException('The original world map asset (world.jpg) is missing or unreadable.');
        }
        $map_data = base64_encode($map_image);
    }
    $map = $map_enabled
        ? location_map($map_x, $coordinates_provided ? (float) $latitude_value : 0, $coordinates_provided ? (float) $longitude_value : 0, $coordinates_provided, $map_marker_color, $map_marker_size, $map_night_strength, $map_data, $now->getTimestamp())
        : '';
    $output_width = $map_enabled ? (int) round($map_x + 242) : $width;
    $height = $map_enabled ? 120 : 30;
    $clock_transform = $map_enabled ? 'translate(0 49)' : 'translate(0 0)';

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $output_width . '" height="' . $height . '" viewBox="0 0 ' . $output_width . ' ' . $height . '" role="img" aria-label="' . escape_xml($title) . '"><title>' . escape_xml($title) . '</title><defs><clipPath id="flagCorners"><rect width="18" height="12" rx="1.5"/></clipPath></defs><g transform="' . $clock_transform . '"><g transform="translate(1 9)">' . $flag_markup . '</g><g font-family="' . FONT . '" font-size="18" font-weight="600">' . implode('', $parts) . '</g>' . ($visible_label !== '' ? '<text x="' . $label_x . '" y="19.5" font-family="' . FONT . '" font-size="12" fill="' . $colors['label'] . '">' . escape_xml($visible_label) . '</text>' : '') . $badge . '</g>' . $map . '</svg>';
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'HEAD') {
    header('Allow: GET, HEAD');
    http_response_code(405);
    exit('Method not allowed');
}

if (($_GET['health'] ?? '') === '1') {
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store');
    if ($method !== 'HEAD') {
        echo 'ok';
    }
    exit;
}

header('Content-Type: image/svg+xml; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
if ($method !== 'HEAD') {
    echo render_clock();
}
