<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once __DIR__ . '/db.php';

// Getting the JSON input
$inData = getRequestInfo();

if (!$inData) {
    returnWithError("No input data");
    exit();
}

// Validate input
if (!isset($inData['firstName'], $inData['lastName'], $inData['username'], $inData['password'])) {
    returnWithError("All fields are required: firstName, lastName, username, password");
    exit();
}

$FName = $inData['firstName'];
$LName = $inData['lastName'];
$Username = $inData['username'];
$Password = $inData['password']; // Plain text password

$conn = get_db_connection();
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// Check if username already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Username = ?");
$stmt->bind_param("s", $Username);
$stmt->execute();
$result = $stmt->get_result();
if ($result->fetch_assoc()) {
    $stmt->close();
    returnWithError("Username already taken");
    exit();
}
$stmt->close();

// Hash password before insert
$hashedPassword = password_hash($Password, PASSWORD_DEFAULT);

// Insert new user
$insertStmt = $conn->prepare("INSERT INTO Users (FName, LName, Username, Password) VALUES (?, ?, ?, ?)");
if (!$insertStmt) {
    returnWithError("Prepare failed: " . $conn->error);
    exit();
}

$insertStmt->bind_param("ssss", $FName, $LName, $Username, $hashedPassword);

if ($insertStmt->execute()) {
    returnWithInfo($FName, $LName, $conn->insert_id);
} else {
    http_response_code(500);
    returnWithError("Failed to register user: " . $insertStmt->error);
}

$insertStmt->close();
$conn->close();


// Helper functions
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
