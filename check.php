<?php
header('Content-Type: text/plain; charset=utf-8');
$cache = __DIR__ . '/cache';
$checks = [
    'PHP' => PHP_VERSION,
    'GD loaded' => extension_loaded('gd') ? 'YES' : 'NO',
    'GD JPEG support' => function_exists('imagecreatefromjpeg') ? 'YES' : 'NO',
    'GD imagegif support' => function_exists('imagegif') ? 'YES' : 'NO',
    'cache directory exists' => is_dir($cache) ? 'YES' : 'NO',
    'cache writable' => is_dir($cache) && is_writable($cache) ? 'YES' : 'NO',
    'world.jpg' => is_file(__DIR__ . '/world.jpg') ? 'YES' : 'NO',
    'world.jpg readable' => is_readable(__DIR__ . '/world.jpg') ? 'YES' : 'NO',
];
foreach ($checks as $k => $v) echo str_pad($k, 25) . $v . "\n";
