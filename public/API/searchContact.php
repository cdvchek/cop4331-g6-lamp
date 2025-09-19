<?php
header('Content-Type: application/json; charset=utf-8');
// Don't print warnings/notices as HTML in the response:
ini_set('display_errors', 0);
error_reporting(E_ALL);

session_start();

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/util.php';

function returnWithError($code, $err) {
  $response = [
    "status" => "error",
    "message" => $err,
  ];
  http_response_code($code);
  sendResultInfoAsJson(json_encode($response));
  exit;
}

function returnWithInfo($code, $data) {
  $response = [
    "status" => "success",
    "message" => "successfully searched",
    "data" => $data
  ];
  http_response_code($code);
  sendResultInfoAsJson(json_encode($response));
  exit;
}

// Check login
if (!isset($_SESSION["user_id"])) {
  returnWithError(401, "You must be logged in");
}

$UserID = $_SESSION["user_id"];
$inData = getRequestInfo() ?? [];

// Ensure client and backend are synced
if (!isset($inData['UserID'])) {
  returnWithError(400, "Missing client UserID");
}
if ($UserID !== (int)$inData['UserID']) {
  returnWithError(400, "Session ID does not match client ID");
}

$query = isset($inData['query']) ? trim($inData['query']) : '';

$conn = get_db_connection();
if ($conn->connect_error) {
  returnWithError(500, $conn->connect_error);
}

if ($query === '') {
  returnWithInfo(200, []);
}

$sql = 'SELECT ID, FName, LName, Phone, Email 
        FROM Contacts 
        WHERE UserID = ? 
        AND (FName LIKE ? OR LName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
        ORDER BY LName, FName';

$likeQuery = '%' . $query . '%';
$types  = 'issss';
$params = [$UserID, $likeQuery, $likeQuery, $likeQuery, $likeQuery];

$stmt = $conn->prepare($sql);
if (!$stmt) {
  returnWithError(500, $conn->error);
}

if (!$stmt->bind_param($types, ...$params)) {
  $stmt->close();
  returnWithError(500, "Failed to bind parameters");
}

if (!$stmt->execute()) {
  $err = $stmt->error;
  $stmt0->close();
  returnWithError(500, $err);
}

$result = $stmt->get_result();
$data = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

$stmt->close();
$conn->close();

returnWithInfo(200, $data);