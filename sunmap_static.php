<?php
declare(strict_types=1);
if (!extension_loaded('gd')) { http_response_code(500); header('Content-Type:text/plain'); exit('GD is not enabled.'); }
$base = __DIR__ . '/world.jpg';
if (!is_file($base)) { http_response_code(500); header('Content-Type:text/plain'); exit('world.jpg missing.'); }
$img = imagecreatefromjpeg($base);
if (!defined('SHOW_BERLIN_MARKER')) define('SHOW_BERLIN_MARKER', true);
$now = time();
// Reuse the same rendering functions from sunmap.php without emitting the GIF.
require __DIR__ . '/sunmap_render.php';
renderTwilightOverlay($img, $now);
renderLabels($img, $now);
header('Content-Type: image/png');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
imagepng($img, null, 6);
imagedestroy($img);
