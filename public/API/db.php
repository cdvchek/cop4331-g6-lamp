<?php
header('Content-Type: application/json');

function parse_db_url($url) {
    $parsed_url = parse_url($url);
    return [
        'host' => $parsed_url['host'],
        'port' => isset($parsed_url['port']) ? $parsed_url['port'] : 3306,
        'user' => $parsed_url['user'],
        'pass' => $parsed_url['pass'],
        'db' => ltrim($parsed_url['path'], '/')
    ];
}

function get_db_connection() {
    $url = getenv('JAWSDB_URL') ?: getenv('CLEARDB_DATABASE_URL') ?: '';
    if ($url) {
        $connection = parse_db_url($url);
        $mysqli = new mysqli(
            $connection['host'],
            $connection['user'],
            $connection['pass'],
            $connection['db'],
            $connection['port']
        );
    } else {
        // Idk error handling or something
    }

    if ($mysqli->connect_errno) {
        http_response_code(500);
        echo json_encode(["error" => "DB connect failed: " . $mysqli->connect_error]);
        exit;
    }
    $mysqli->set_charset('utf8mb4');
    return $mysqli;
}