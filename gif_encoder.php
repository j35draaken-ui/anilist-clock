<?php
declare(strict_types=1);

/**
 * Small animated GIF assembler for PHP/GD.
 *
 * It deliberately lets GD do the hard part: each frame is first encoded by
 * imagegif(), then the individual GIF image block + palette is assembled into
 * one valid GIF89a animation. This avoids a hand-written LZW encoder.
 */
final class SimpleGifEncoder
{
    private int $width;
    private int $height;
    private string $gif = '';
    private bool $started = false;
    private int $loop = 0;

    public function __construct(int $width, int $height)
    {
        $this->width = $width;
        $this->height = $height;
    }

    public function start(int $loop = 0): void
    {
        if ($this->started) {
            return;
        }
        $this->started = true;
        $this->loop = max(0, $loop);

        // GIF89a + logical screen descriptor, with NO global color table.
        $this->gif = 'GIF89a'
            . pack('v2', $this->width, $this->height)
            . "\x00\x00\x00";

        // Netscape loop extension: 0 = forever.
        $this->gif .= "!\xFF\x0BNETSCAPE2.0\x03\x01"
            . pack('v', $this->loop)
            . "\x00";
    }

    /** Add a GD frame, with delay in GIF hundredths of a second. */
    public function addFrame($image, int $delayHundredths = 50): void
    {
        if (!$this->started) {
            $this->start(0);
        }

        if (!function_exists('imagegif')) {
            throw new RuntimeException('PHP GD/imagegif is required.');
        }

        if (imagesx($image) !== $this->width || imagesy($image) !== $this->height) {
            throw new InvalidArgumentException('Frame dimensions do not match GIF dimensions.');
        }

        ob_start();
        imagegif($image);
        $frameGif = ob_get_clean();
        if (!is_string($frameGif) || strlen($frameGif) < 14) {
            throw new RuntimeException('GD failed to encode a GIF frame.');
        }

        $this->gif .= $this->buildFrameBlock(
            $frameGif,
            max(2, min(65535, $delayHundredths))
        );
    }

    public function finish(): string
    {
        if (!$this->started) {
            $this->start(0);
        }
        return $this->gif . ';';
    }

    private function buildFrameBlock(string $src, int $delay): string
    {
        if (substr($src, 0, 6) !== 'GIF87a' && substr($src, 0, 6) !== 'GIF89a') {
            throw new RuntimeException('GD returned an invalid GIF frame.');
        }

        $logicalWidth = unpack('v', substr($src, 6, 2))[1];
        $logicalHeight = unpack('v', substr($src, 8, 2))[1];
        if ($logicalWidth !== $this->width || $logicalHeight !== $this->height) {
            throw new RuntimeException('GD GIF frame size does not match output size.');
        }

        $packed = ord($src[10]);
        $hasGct = ($packed & 0x80) !== 0;
        $gctSize = $hasGct ? (3 * (1 << (($packed & 0x07) + 1))) : 0;
        $offset = 13 + $gctSize;
        $globalPalette = $hasGct ? substr($src, 13, $gctSize) : '';

        // Find the first image descriptor, skipping any GD extensions.
        while ($offset < strlen($src)) {
            $marker = ord($src[$offset]);
            if ($marker === 0x2C) { // Image Descriptor
                break;
            }
            if ($marker === 0x3B) {
                throw new RuntimeException('GIF frame contains no image descriptor.');
            }
            if ($marker === 0x21) { // Extension block
                $offset = $this->skipExtension($src, $offset);
                continue;
            }
            throw new RuntimeException('Unexpected GIF block while parsing frame.');
        }

        if ($offset + 10 > strlen($src)) {
            throw new RuntimeException('Truncated GIF image descriptor.');
        }

        $descriptor = substr($src, $offset, 10);
        $imagePacked = ord($descriptor[9]);
        $hasLct = ($imagePacked & 0x80) !== 0;
        $lctSize = $hasLct ? (3 * (1 << (($imagePacked & 0x07) + 1))) : 0;

        $palette = $hasLct ? substr($src, $offset + 10, $lctSize) : $globalPalette;
        if ($palette === '') {
            throw new RuntimeException('GIF frame has no color table.');
        }

        if (!$hasLct) {
            // Promote the source global table to a local table for this frame.
            // The local table size must match the palette length.
            $colors = intdiv(strlen($palette), 3);
            $tablePower = (int)round(log($colors, 2)) - 1;
            $tablePower = max(0, min(7, $tablePower));

            $imagePacked = ord($descriptor[9]);
            $imagePacked = ($imagePacked & 0x78) | 0x80 | $tablePower;
            $descriptor[9] = chr($imagePacked);

            $dataOffset = $offset + 10;
        } else {
            $dataOffset = $offset + 10 + $lctSize;
        }

        // Find the end of the image data (the zero-sized sub-block terminator).
        $dataEnd = $this->findImageDataEnd($src, $dataOffset);
        $imageData = substr($src, $dataOffset, $dataEnd - $dataOffset);

        // GCE: disposal=1 (leave the fully drawn frame in place), no transparency.
        $gce = "!\xF9\x04" . "\x04" . pack('v', $delay) . "\x00\x00";

        // Descriptor + palette + compressed image data.
        return $gce . $descriptor . $palette . $imageData;
    }

    private function skipExtension(string $src, int $offset): int
    {
        $len = strlen($src);
        if ($offset + 2 > $len) {
            throw new RuntimeException('Truncated GIF extension.');
        }
        $label = ord($src[$offset + 1]);
        $p = $offset + 2;

        if ($label === 0xF9) { // Graphic Control Extension: 4-byte payload + terminator
            return $p + 1 + 4 + 1;
        }

        if ($label === 0x01) { // Plain Text Extension: 12-byte fixed header + subblocks
            $p += 1;
            $p += 12;
            return $this->skipSubBlocks($src, $p);
        }

        if ($label === 0xFF) { // Application Extension: 11-byte app ID + subblocks
            $p += 1;
            $p += 11;
            return $this->skipSubBlocks($src, $p);
        }

        // Comment Extension (0xFE) and unknown extension: subblocks directly follow.
        return $this->skipSubBlocks($src, $p);
    }

    private function skipSubBlocks(string $src, int $offset): int
    {
        $len = strlen($src);
        $p = $offset;
        while ($p < $len) {
            $size = ord($src[$p]);
            $p += 1;
            if ($size === 0) {
                return $p;
            }
            $p += $size;
        }
        throw new RuntimeException('Truncated GIF sub-block sequence.');
    }

    private function findImageDataEnd(string $src, int $offset): int
    {
        $len = strlen($src);
        if ($offset >= $len) {
            throw new RuntimeException('Truncated GIF image data.');
        }

        // First byte is LZW minimum code size.
        $p = $offset + 1;
        while ($p < $len) {
            $size = ord($src[$p]);
            $p += 1;
            if ($size === 0) {
                return $p;
            }
            $p += $size;
        }
        throw new RuntimeException('Truncated GIF image data sub-blocks.');
    }
}
