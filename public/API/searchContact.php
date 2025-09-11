<?php
header('Content-Type: application/json; charset=utf-8');
// Don't print warnings/notices as HTML in the response:
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/util.php';

function respond($arr) { echo json_encode($arr); exit; }

$inData = getRequestInfo() ?? [];

// Accept either casing from client
$FName = isset($inData['FName']) ? trim($inData['FName']) : '';
$LName = isset($inData['LName']) ? trim($inData['LName']) : '';
$UserID = isset($inData['UserID']) ? intval($inData['UserID'])
        : (isset($inData['userId']) ? intval($inData['userId']) : 0);

if ($UserID <= 0) {
  respond(["status" => "error", "message" => "Missing or invalid UserID"]);
}

$conn = get_db_connection();
if ($conn->connect_error) {
  respond(["status" => "error", "message" => $conn->connect_error]);
}

// Build LIKEs once
$FLike = '%' . $FName . '%';
$LLike = '%' . $LName . '%';

// IMPORTANT: parentheses to bind the OR with the same UserID
$sql = 'SELECT FName, LName, Phone, Email
        FROM Contacts
        WHERE UserID = ?
          AND (FName LIKE ? OR LName LIKE ?)
        ORDER BY LName, FName';

$stmt = $conn->prepare($sql);
if (!$stmt) {
  respond(["status" => "error", "message" => $conn->error]);
}

$stmt->bind_param('iss', $UserID, $FLike, $LLike);

if (!$stmt->execute()) {
  respond(["status" => "error", "message" => $stmt->error]);
}

$result = $stmt->get_result();
$data = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

respond(["status" => "success", "data" => $data]);