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

function location_map(float $x, float $latitude, float $longitude, bool $coordinates_provided, string $water, string $land, string $grid, string $marker_color, int $marker_size): string
{
    $marker = $coordinates_provided
        ? '<circle cx="' . (1 + (($longitude + 180) / 360) * 94) . '" cy="' . (1 + ((90 - $latitude) / 180) * 30) . '" r="' . ($marker_size + 2) . '" fill="' . $marker_color . '" fill-opacity=".24"/><circle cx="' . (1 + (($longitude + 180) / 360) * 94) . '" cy="' . (1 + ((90 - $latitude) / 180) * 30) . '" r="' . $marker_size . '" fill="' . $marker_color . '" stroke="#ffffff" stroke-width="1.2"/>'
        : '<text x="48" y="18" text-anchor="middle" font-family="sans-serif" font-size="5" font-weight="600" letter-spacing=".7" fill="#ffffff">ADD COORDINATES</text>';
    $map = '<g aria-label="' . ($coordinates_provided ? 'Map showing selected location' : 'Map; coordinates needed to place marker') . '"><rect x="0" y="0" width="96" height="32" rx="4" fill="' . $water . '"/><g fill="none" stroke="' . $grid . '" stroke-opacity=".42" stroke-width=".35"><path d="M0 8h96M0 16h96M0 24h96M24 0v32M48 0v32M72 0v32"/></g><g fill="' . $land . '" stroke="' . $grid . '" stroke-opacity=".42" stroke-width=".45"><path d="M9 6 14 3 22 4 25 7 31 7 34 11 31 13 29 17 25 17 23 21 20 19 18 15 14 13 13 10 10 9z"/><path d="m28 19 5 1 3 4-2 4-2 3-2-3-1-4-3-3z"/><path d="m43 7 4-2 4 1 2 3-3 2-4-1z"/><path d="m45 12 6-1 4 3 1 5-3 6-3 3-2-4-3-4-2-5z"/><path d="m51 6 8-2 7 2 7-1 9 4-2 4-6 1-2 4-5-1-4-3-5 1-4-3-5 1-2-3z"/><path d="m73 22 5 1 3 3-3 3-5-1-2-3z"/></g>' . $marker . '</g>';

    return '<svg x="' . $x . '" y="3" width="96" height="32" viewBox="0 0 96 32">' . $map . '</svg>';
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
    $map_enabled = ($_GET['map'] ?? '') !== '0';
    $map_water = normalize_color($_GET['mapwater'] ?? null, '#10242c');
    $map_land = normalize_color($_GET['mapland'] ?? null, '#31545a');
    $map_grid = normalize_color($_GET['mapgrid'] ?? null, '#557279');
    $map_marker_color = normalize_color($_GET['mapmarker'] ?? null, $dot_color);
    $requested_marker_size = $_GET['mapdot'] ?? null;
    $map_marker_size = is_string($requested_marker_size) && preg_match('/^[2-7]$/D', $requested_marker_size) === 1
        ? (int) $requested_marker_size
        : 4;
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
    for ($index = 0; $index < 24; $index++) {
        $hours[] = str_pad((string) $index, 2, '0', STR_PAD_LEFT);
    }

    $parts = [];
    $x = $flag_markup !== '' ? 26 : 1;
    $seconds_of_day = $hour * 3600 + $minute * 60 + $second;
    $parts[] = strip_svg($x, array_map(static fn(string $value): string => $value[0], $hours), 3600, $seconds_of_day, $colors['digits']); $x += 11;
    $parts[] = strip_svg($x, array_map(static fn(string $value): string => $value[1], $hours), 3600, $seconds_of_day, $colors['digits']); $x += 11;
    $parts[] = colon_svg($x, $colors['colon']); $x += 6;
    $parts[] = strip_svg($x, str_split('012345'), 600, $minute * 60 + $second, $colors['digits']); $x += 11;
    $parts[] = strip_svg($x, str_split('0123456789'), 60, ($minute % 10) * 60 + $second, $colors['digits']); $x += 11;
    $parts[] = colon_svg($x, $colors['colon']); $x += 6;
    $parts[] = strip_svg($x, str_split('012345'), 10, $second, $colors['seconds']); $x += 11;
    $parts[] = strip_svg($x, str_split('0123456789'), 1, $second % 10, $colors['seconds']); $x += 11;

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
    $title = $timezone . ' clock' . ($visible_label !== '' ? ' — ' . $visible_label : '') . $daylight_description;
    $badge = $sun_enabled
        ? '<g aria-label="' . $daylight_text . ($coordinates_provided ? ', solar-calculated' : ', estimated from local time') . '"><rect x="' . $badge_x . '" y="5" width="' . $badge_width . '" height="20" rx="10" fill="' . $daylight_color . '" fill-opacity=".16"/><circle cx="' . ($badge_x + 8) . '" cy="15" r="2.5" fill="' . $dot_color . '"/><text x="' . ($badge_x + 14) . '" y="18" font-family="' . FONT . '" font-size="8" font-weight="600" fill="' . $daylight_color . '">' . $daylight_text . '</text></g>'
        : '';
    $map_x = $sun_enabled
        ? $badge_x + $badge_width + 8
        : ($visible_label !== '' ? $label_x + $label_length * 6.6 + 8 : $x + 8);
    $map = $map_enabled
        ? location_map($map_x, $coordinates_provided ? (float) $latitude_value : 0, $coordinates_provided ? (float) $longitude_value : 0, $coordinates_provided, $map_water, $map_land, $map_grid, $map_marker_color, $map_marker_size)
        : '';
    $content_width = $map_enabled
        ? $map_x + 98
        : ($sun_enabled
            ? $badge_x + $badge_width + 2
            : ($visible_label !== '' ? $label_x + $label_length * 6.6 + 2 : $x + 2));
    $width = max($width, (int) round($content_width));
    $height = $map_enabled ? 38 : 30;

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="' . $height . '" viewBox="0 0 ' . $width . ' ' . $height . '" role="img" aria-label="' . escape_xml($title) . '"><title>' . escape_xml($title) . '</title><defs><clipPath id="flagCorners"><rect width="18" height="12" rx="1.5"/></clipPath></defs><g transform="translate(1 9)">' . $flag_markup . '</g><g font-family="' . FONT . '" font-size="18" font-weight="600">' . implode('', $parts) . '</g>' . ($visible_label !== '' ? '<text x="' . $label_x . '" y="19.5" font-family="' . FONT . '" font-size="12" fill="' . $colors['label'] . '">' . escape_xml($visible_label) . '</text>' : '') . $badge . $map . '</svg>';
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
