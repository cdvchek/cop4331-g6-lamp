<?php
session_start();

include('./util.php');
require_once __DIR__ . '/db.php';

//Checking to see if user is logged in
if(!isset($_SESSION["user_id"])){
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "you must be logged in"]);
    exit();
}

// Use session user_id instead of sending it from client
$UserID = $_SESSION["user_id"];


// Getting the JSON input from the Client
$inData = getRequestInfo();

// Validate input
if (!$inData) {
    http_response_code(400); // Not Found
    returnWithError("No input data");
    exit();
}

// Required fields check
$requiredFields = ["ContactID", "FName", "LName", "Phone", "Email"];
foreach ($requiredFields as $field) {
    if (!isset($inData[$field])) {
        http_response_code(400); // Bad Request
        returnWithError("Missing field: " . $field);
        exit();
    }
}

$FName = trim($inData["FName"]);
$LName = trim($inData["LName"]);
$Phone = trim($inData["Phone"]);
$Email = strtolower(trim($inData["Email"])); // Normalize email to lowercase
$ContactID = strtolower(trim($inData["ContactID"])); 

//------------- Input validations ------------------//

// Validating name lengths to prevent excessively long entries
if (strlen($FName) > 50 || strlen($LName) > 50) {
    http_response_code(400); // Bad Request
    returnWithError("First and Last names must be 50 characters or fewer");
    exit();
}

// Validate phone format (digits ony, 10-15 characters)
if (!preg_match('/^\d{10,15}$/', $Phone)) {
    http_response_code(400); // Bad Request
    returnWithError("Phone number must be 10 to 15 digits");
    exit();
}   

// Validate email format
$emailPattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'; 
if(!filter_var($Email, FILTER_VALIDATE_EMAIL) || !preg_match($emailPattern, $Email)) {
    http_response_code(400); // Bad Request
    returnWithError("Invalid email format");
    exit();
}

// Validating email length
if (strlen($Email) > 100) {
    http_response_code(400); // Bad Request
    returnWithError("Email must be 100 characters or fewer");
    exit();
}   
//------------- End Input validations ------------------//


// Database connection
$conn = get_db_connection();

// Check connection
if ($conn->connect_error) 
{
    http_response_code(500);
    returnWithError($conn->connect_error);
    exit();
}

//------------- Additional Validations ------------------//

// Check for duplicate phone or email for this user
$stmt = $conn->prepare("UPDATE Contacts SET FName = ?, LName = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ?;");
$stmt->bind_param("ssssii", $FName, $LName, $Phone, $Email, $ContactID, $UserID);


// Executing the update and checking for success
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["status" => "success", "rows_updated" => $stmt->affected_rows]);
    } else {
        http_response_code(204);
        echo json_encode(["status" => "no change"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}


// Closing the statement and connection
$stmt->close();
$conn->close();

function returnWithError( $err )
{
    echo json_encode(["status"=> "error", "message"=> $err]);
}


