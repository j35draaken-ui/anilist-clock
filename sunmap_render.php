<?php
declare(strict_types=1);

function solarPosition(int $timestamp): array
{
    $jd = $timestamp / 86400.0 + 2440587.5;
    $T = ($jd - 2451545.0) / 36525.0;

    $L0 = fmod(280.46646 + $T * (36000.76983 + 0.0003032 * $T), 360.0);
    if ($L0 < 0) $L0 += 360.0;

    $M = deg2rad(fmod(357.52911 + $T * (35999.05029 - 0.0001537 * $T), 360.0));
    $C = (1.914602 - $T * (0.004817 + 0.000014 * $T)) * sin($M)
       + (0.019993 - 0.000101 * $T) * sin(2 * $M)
       + 0.000289 * sin(3 * $M);

    $trueLong = $L0 + $C;
    $omega = deg2rad(125.04 - 1934.136 * $T);
    $lambda = deg2rad($trueLong - 0.00569 - 0.00478 * sin($omega));

    $eps = 23.439291 - 0.0130042 * $T + 0.00256 * cos($omega);
    $epsRad = deg2rad($eps);

    $declDeg = rad2deg(asin(sin($epsRad) * sin($lambda)));

    $L0rad = deg2rad($L0);
    $e = 0.016708634 - $T * (0.000042037 + 0.0000001267 * $T);
    $y = tan($epsRad / 2.0);
    $y *= $y;
    $eqTime = 4.0 * rad2deg(
        $y * sin(2 * $L0rad)
        - 2 * $e * sin($M)
        + 4 * $e * $y * sin($M) * cos(2 * $L0rad)
        - 0.5 * $y * $y * sin(4 * $L0rad)
        - 1.25 * $e * $e * sin(2 * $M)
    );

    $utcHours = (int)gmdate('G', $timestamp)
        + (int)gmdate('i', $timestamp) / 60.0
        + (int)gmdate('s', $timestamp) / 3600.0;

    $subsolarLon = 180.0 - 15.0 * $utcHours - $eqTime / 4.0;
    while ($subsolarLon > 180) $subsolarLon -= 360;
    while ($subsolarLon < -180) $subsolarLon += 360;

    return [$declDeg, $subsolarLon];
}

function renderTwilightOverlay($img, int $timestamp): void
{
    [$decl, $subsolarLon] = solarPosition($timestamp);
    $W = imagesx($img);
    $H = imagesy($img);

    $sinLat = $cosLat = [];
    for ($y = 0; $y < $H; $y++) {
        $lat = deg2rad(90.0 - (($y + 0.5) * 180.0 / $H));
        $sinLat[$y] = sin($lat);
        $cosLat[$y] = cos($lat);
    }

    $sinDec = sin(deg2rad($decl));
    $cosDec = cos(deg2rad($decl));
    $sinCivil = sin(deg2rad(-6.0));
    $sinNautical = sin(deg2rad(-12.0));
    $sinAstronomical = sin(deg2rad(-18.0));

    // GD alpha is 0 = opaque, 127 = fully transparent.
    // These are integer values only.
    // Black overlay transparency: 0 = opaque, 127 = invisible.
    // Civil / nautical / astronomical twilight / night.
    // Night is deliberately strong so it is clearly darker than daylight.
    $alpha = [105, 85, 60, 30];
    $colors = [];
    foreach ($alpha as $a) {
        $colors[] = imagecolorallocatealpha($img, 0, 0, 8, $a);
    }
    $edgeColor = imagecolorallocatealpha($img, 255, 255, 255, 35);

    for ($x = 0; $x < $W; $x++) {
        $lon = -180.0 + (($x + 0.5) * 360.0 / $W);
        $Hrad = deg2rad($lon - $subsolarLon);
        $cosH = cos($Hrad);

        $runState = -1;
        $runStart = 0;

        for ($y = 0; $y < $H; $y++) {
            $sinAlt = $sinLat[$y] * $sinDec + $cosLat[$y] * $cosDec * $cosH;

            if ($sinAlt >= 0.0) $state = 0;
            elseif ($sinAlt >= $sinCivil) $state = 1;
            elseif ($sinAlt >= $sinNautical) $state = 2;
            elseif ($sinAlt >= $sinAstronomical) $state = 3;
            else $state = 4;

            if ($runState === -1) {
                $runState = $state;
                $runStart = $y;
            } elseif ($state !== $runState) {
                drawStateRun($img, $x, $runStart, $y - 1, $runState, $colors);
                if (($runState === 0 && $state === 1) || ($runState === 1 && $state === 0)) {
                    imagesetpixel($img, $x, max(0, $y - 1), $edgeColor);
                }
                $runState = $state;
                $runStart = $y;
            }
        }
        drawStateRun($img, $x, $runStart, $H - 1, $runState, $colors);
    }

    $sx = (int)round(($subsolarLon + 180.0) / 360.0 * ($W - 1));
    $sy = (int)round((90.0 - $decl) / 180.0 * ($H - 1));
    $outer = imagecolorallocate($img, 255, 255, 255);
    $sun = imagecolorallocate($img, 255, 205, 50);
    imageellipse($img, $sx, $sy, 13, 13, $outer);
    imagefilledellipse($img, $sx, $sy, 7, 7, $sun);
}

function drawStateRun($img, int $x, int $y1, int $y2, int $state, array $colors): void
{
    if ($state <= 0) return;
    imagefilledrectangle($img, $x, $y1, $x, $y2, $colors[$state - 1]);
}

function renderLabels($img, int $timestamp): void
{
    $W = imagesx($img);
    $H = imagesy($img);

    $bg = imagecolorallocatealpha($img, 0, 0, 0, 70);
    $fg = imagecolorallocate($img, 255, 255, 255);
    $text = 'UTC ' . gmdate('H:i', $timestamp);
    $font = 3;
    $tw = imagefontwidth($font) * strlen($text);
    $th = imagefontheight($font);
    imagefilledrectangle($img, $W - $tw - 12, 6, $W - 6, 9 + $th, $bg);
    imagestring($img, $font, $W - $tw - 9, 8, $text, $fg);

    if (defined('SHOW_BERLIN_MARKER') && SHOW_BERLIN_MARKER) {
        $x = (int)round((13.4050 + 180.0) / 360.0 * ($W - 1));
        $y = (int)round((90.0 - 52.5200) / 180.0 * ($H - 1));
        $ring = imagecolorallocate($img, 255, 255, 255);
        $dot = imagecolorallocate($img, 90, 230, 130);
        imageellipse($img, $x, $y, 10, 10, $ring);
        imagefilledellipse($img, $x, $y, 4, 4, $dot);
    }
}
