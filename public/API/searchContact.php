<?php
header('Content-Type: application/json; charset=utf-8');
// Don't print warnings/notices as HTML in the response:
ini_set('display_errors', 0);
error_reporting(E_ALL);

session_start();

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/util.php';


function respond($arr) { echo json_encode($arr); exit; }

// Check login
if (!isset($_SESSION["user_id"])) {
    http_response_code(401); // Unauthorized
    respond(["status" => "error", "message" => "You must be logged in"]);
}

$UserID = $_SESSION["user_id"]; // ✅ use session instead of input

$inData = getRequestInfo() ?? [];

// Accept either casing from client
$FName = isset($inData['FName']) ? trim($inData['FName']) : '';
$LName = isset($inData['LName']) ? trim($inData['LName']) : '';


$conn = get_db_connection();
if ($conn->connect_error) {
  respond(["status" => "error", "message" => $conn->connect_error]);
}

// Start building SQL query dynamically
$sql = 'SELECT ContactID, FName, LName, Phone, Email FROM Contacts WHERE UserID = ?';
$params = [$UserID];
$types = 'i';

if ($FName !== '') {
    $sql .= ' AND FName = ?';
    $types .= 's';
    $params[] = $FName;
}
if ($LName !== '') {
    $sql .= ' AND LName = ?';
    $types .= 's';
    $params[] = $LName;
}

$sql .= ' ORDER BY LName, FName';

//-------------------------------------------//
// Commented Code below: if one of the required query (Fname or Lname) is left empty
// It returns all the connacts of the user. We don't want that. 
/*
$FLike = '%' . $FName . '%';
$LLike = '%' . $LName . '%';
 */
/*
// IMPORTANT: parentheses to bind the OR with the same UserID
$sql = 'SELECT ContactID, FName, LName, Phone, Email
        FROM Contacts
        WHERE UserID = ?
          AND (FName LIKE ? OR LName LIKE ?)
        ORDER BY LName, FName';
*/
//---------------------------------------//

$stmt = $conn->prepare($sql);

if (!$stmt) {
  respond(["status" => "error", "message" => $conn->error]);
}

// Bind dynamically using $params
$stmt->bind_param($types, ...$params);

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