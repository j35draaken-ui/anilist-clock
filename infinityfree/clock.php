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
    $width = (int) round($visible_label !== '' ? $label_x + $label_length * 6.6 + 2 : $x + 2);
    $title = $timezone . ' clock' . ($visible_label !== '' ? ' — ' . $visible_label : '');

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="30" viewBox="0 0 ' . $width . ' 30" role="img" aria-label="' . escape_xml($title) . '"><title>' . escape_xml($title) . '</title><defs><clipPath id="flagCorners"><rect width="18" height="12" rx="1.5"/></clipPath></defs><g transform="translate(1 9)">' . $flag_markup . '</g><g font-family="' . FONT . '" font-size="18" font-weight="600">' . implode('', $parts) . '</g>' . ($visible_label !== '' ? '<text x="' . $label_x . '" y="19.5" font-family="' . FONT . '" font-size="12" fill="' . $colors['label'] . '">' . escape_xml($visible_label) . '</text>' : '') . '</svg>';
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
