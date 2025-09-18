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

$UserID = $_SESSION["user_id"];
$inData = getRequestInfo() ?? [];

if ($UserID != $inData['UserID']) {
    http_response_code(400);
    returnWithError("Session ID does not match client ID");
}

$query = isset($inData['query']) ? trim($inData['query']) : '';

$conn = get_db_connection();
if ($conn->connect_error) {
  respond(["status" => "error", "message" => $conn->connect_error]);
}

if ($query === '') {
    returnWithInfo([]);
    exit();
}

$sql = 'SELECT ID, FName, LName, Phone, Email 
        FROM Contacts 
        WHERE UserID = ? 
        AND (FName LIKE ? OR LName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
        ORDER BY LName, FName';

$likeQuery = '%' . $query . '%';

$params = [$UserID, $likeQuery, $likeQuery, $likeQuery, $likeQuery];
$types  = 'issss';

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

// Helper functions for JSON response
function returnWithError( $err )
{
	$response = [
		"status" => "error",
		"message" => $err,
    ];
	sendResultInfoAsJson( json_encode($response) );
}

function returnWithInfo( $data )
{
	$response = [
		"status" => "success",
		"message" => "successfully registered",
		"data" => $data
    ];
    
	sendResultInfoAsJson( json_encode($response) );
}