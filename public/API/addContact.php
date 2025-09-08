<?php
include('./util.php');
require_once __DIR__ . '/db.php';

// Getting the JSON input from the Client
$inData = getRequestInfo();

// Validate input
if (!$inData) {
    returnWithError("No input data");
    exit();
}

// Required fields check
$requiredFields = ["FName", "LName", "Phone", "Email", "UserID"];
foreach ($requiredFields as $field) {
    if (!isset($inData[$field])) {
        returnWithError("Missing field: " . $field);
        exit();
    }
}   

$FName = $inData["FName"];
$LName = $inData["LName"];
$Phone = $inData["Phone"];
$Email = $inData["Email"];
$UserID = $inData["UserID"];

// Database connection
$conn = get_db_connection();

// Check connection
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
    exit();
} 
// Prepare and bind
$stmt = $conn->prepare("INSERT INTO Contacts (FName, LName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");

$stmt->bind_param("ssssi", $FName, $LName, $Phone, $Email, $UserID);

// Executing the insert and checking for success
if($stmt->execute()) {
    echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
} 
// If execution fails, return an error message
else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

// Closing the statement and connection
$stmt->close();
$conn->close();

function returnWithError( $err )
{
    echo json_encode(["status"=> "error", "message"=> $err]);
}

?>


