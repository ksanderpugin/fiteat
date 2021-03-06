<?php
function render($view,$data)
{
    if (!file_exists($view)) return 'Error filename' . PHP_EOL;
    ob_start();
    extract($data);
    include $view;
    $view_data = ob_get_clean();
    return $view_data;
}

function writeLog($str) {
	file_put_contents(__DIR__.'/log.txt', $str . PHP_EOL, FILE_APPEND);
}