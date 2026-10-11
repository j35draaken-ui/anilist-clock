<?php
declare(strict_types=1);

require __DIR__ . '/gif_encoder.php';
require __DIR__ . '/sunmap_render.php';

const MAP_WIDTH = 480;
const MAP_HEIGHT = 240;
const FRAME_MINUTES = 10;
const ANIMATION_HOURS = 3;
const FRAME_DELAY_CS = 60000;    // 600.00 s = 10 minutes per frame: animation runs in real time.
const CACHE_MAX_AGE = 240;
const SHOW_BERLIN_MARKER = true;

$cacheDir = __DIR__ . '/cache';
$cacheGif = $cacheDir . '/sunmap_v2.gif';
$cacheMeta = $cacheDir . '/sunmap_v2.meta';
$baseMap = __DIR__ . '/world.jpg';

if (!extension_loaded('gd')) {
    sendError('PHP GD is not enabled on this hosting account.');
}
if (!is_file($baseMap)) {
    sendError('world.jpg is missing.');
}

header('Content-Type: image/gif');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

if (!is_dir($cacheDir) && !@mkdir($cacheDir, 0755, true) && !is_dir($cacheDir)) {
    sendError('Cannot create the cache directory. Create /cache manually and make it writable.');
}

// Regenerate from the current minute, so a visitor doesn't start the animation
// at an old 10-minute bucket. The animation itself advances in 10-minute steps.
$bucketSeconds = 60;
$now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$bucketTs = intdiv($now->getTimestamp(), $bucketSeconds) * $bucketSeconds;
$bucketId = gmdate('Y-m-d H:i', $bucketTs);

$meta = is_file($cacheMeta) ? trim((string)@file_get_contents($cacheMeta)) : '';
if (is_file($cacheGif) && $meta === $bucketId) {
    @readfile($cacheGif);
    exit;
}

$lockPath = $cacheDir . '/sunmap.lock';
$lock = @fopen($lockPath, 'c');
if ($lock) {
    @flock($lock, LOCK_EX);
}

try {
    $meta = is_file($cacheMeta) ? trim((string)@file_get_contents($cacheMeta)) : '';
    if (is_file($cacheGif) && $meta === $bucketId) {
        $gif = @file_get_contents($cacheGif);
        if ($gif !== false) {
            cleanupLock($lock);
            echo $gif;
            exit;
        }
    }

    $base = @imagecreatefromjpeg($baseMap);
    if (!$base) {
        throw new RuntimeException('Could not load world.jpg.');
    }
    if (imagesx($base) !== MAP_WIDTH || imagesy($base) !== MAP_HEIGHT) {
        throw new RuntimeException('world.jpg must be exactly ' . MAP_WIDTH . 'x' . MAP_HEIGHT . ' pixels.');
    }

    $encoder = new SimpleGifEncoder(MAP_WIDTH, MAP_HEIGHT);
    $encoder->start(0);

    $frames = intdiv(ANIMATION_HOURS * 60, FRAME_MINUTES);
    for ($f = 0; $f < $frames; $f++) {
        $timestamp = $bucketTs + $f * FRAME_MINUTES * 60;

        $frame = imagecreatetruecolor(MAP_WIDTH, MAP_HEIGHT);
        imagecopy($frame, $base, 0, 0, 0, 0, MAP_WIDTH, MAP_HEIGHT);
        imagealphablending($frame, true);
        imagesavealpha($frame, false);

        renderTwilightOverlay($frame, $timestamp);
        renderLabels($frame, $timestamp);

        // Make an ordinary opaque indexed GIF frame. Alpha is baked into the RGB pixels.
        imagetruecolortopalette($frame, true, 256);
        $encoder->addFrame($frame, FRAME_DELAY_CS);
        imagedestroy($frame);
    }

    imagedestroy($base);
    $gif = $encoder->finish();

    if (@file_put_contents($cacheGif . '.tmp', $gif, LOCK_EX) === false) {
        throw new RuntimeException('Could not write cache/sunmap.gif.');
    }
    if (!@rename($cacheGif . '.tmp', $cacheGif)) {
        @unlink($cacheGif . '.tmp');
        throw new RuntimeException('Could not replace cache/sunmap.gif.');
    }
    @file_put_contents($cacheMeta, $bucketId, LOCK_EX);

    cleanupLock($lock);
    echo $gif;
} catch (Throwable $e) {
    cleanupLock($lock);

    if (is_file($cacheGif)) {
        $gif = @file_get_contents($cacheGif);
        if ($gif !== false) {
            echo $gif;
            exit;
        }
    }

    // Important: because the endpoint normally emits image/gif, switch to plain text on failure.
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Sun-map generation failed: " . $e->getMessage();
}

function cleanupLock($lock): void
{
    if (is_resource($lock)) {
        @flock($lock, LOCK_UN);
        @fclose($lock);
    }
}

function sendError(string $message): never
{
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo $message;
    exit;
}

