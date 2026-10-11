<?php
header('Content-Type: text/plain; charset=utf-8');
echo "SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? '') . "\n";
echo "PATH_INFO: " . ($_SERVER['PATH_INFO'] ?? '(not set)') . "\n";
echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? '') . "\n";
echo "PHP: " . PHP_VERSION . "\n";
