<?php
include('./util.php');
require_once __DIR__ . '/db.php';

try {
    $conn = get_db_connection();
    $result = $conn->query("SELECT 1 AS ok")->fetch_assoc();
    echo json_encode([
        "db" => $result['ok'] == 1 ? "up" : "down"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "db" => "down",
        "error" => $e->getMessage()
    ]);
}
