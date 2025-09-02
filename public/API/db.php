<?php
header('Content-Type: application/json');

function parse_db_url($url) {
    $parsed_url = parse_url($url);
    return [
        'host' => $parsed_url['host'],
        'port' => isset($parsed_url['port']) ? $parsed_url['port'] : 3306,
        'user' => $parsed_url['user'],
        'pass' => $parsed_url['pass'],
        'db'   => ltrim($parsed_url['path'], '/')
    ];
}

function get_db_connection() {
    $url = getenv('JAWSDB_URL') ?: '';
    
    if ($url) {
        // 1. Try Heroku JawsDB
        $c = parse_db_url($url);
    } else {
        // 2. Fallback to local config file
        $c = include __DIR__ . '/config.local.php';
    }

    $mysqli = new mysqli(
        $c['host'],
        $c['user'],
        $c['pass'],
        $c['db'],
        $c['port']
    );

    if ($mysqli->connect_errno) {
        http_response_code(500);
        echo json_encode(["error" => "DB connect failed: " . $mysqli->connect_error]);
        exit;
    }

    $mysqli->set_charset('utf8mb4');
    return $mysqli;
}
