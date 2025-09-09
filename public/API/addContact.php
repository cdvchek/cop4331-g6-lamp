<?php
include('./util.php');
require_once __DIR__ . '/db.php';

// Getting the JSON input from the Client
$inData = getRequestInfo();

// Validate input
if (!$inData) {
    http_response_code(400); // Not Found
    returnWithError("No input data");
    exit();
}

// Required fields check
$requiredFields = ["FName", "LName", "Phone", "Email", "UserID"];
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
$UserID = $inData["UserID"];

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

// Verify that UserID exists in Users table
$userCheckStmt = $conn->prepare("SELECT ID FROM Users WHERE ID = ?");
$userCheckStmt->bind_param("i", $UserID);
$userCheckStmt->execute();
if(!$userCheckStmt->get_result()->fetch_assoc()) {
    http_response_code(400); // Bad Request
    returnWithError("Invalid UserID");
    $userCheckStmt->close();
    $conn->close();
    exit();
}

$userCheckStmt->close();


// Check for duplicate phone or email for this user
$stmt = $conn->prepare("SELECT Phone, Email FROM Contacts WHERE UserID = ? AND (Phone = ? OR Email = ?)");
$stmt->bind_param("iss", $UserID, $Phone, $Email);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    if ($row['Phone'] === $Phone) {
        http_response_code(409);
        returnWithError("Phone number already exists for this user");
        $stmt->close();
        $conn->close();
        exit();
    }
    if ($row['Email'] === $Email) {
        http_response_code(409);
        returnWithError("Email already exists for this user");
        $stmt->close();
        $conn->close();
        exit();
    }
}
$stmt->close();

//------------- End Additional Validations ------------------//

// Insert new contact into the database
$stmt = $conn->prepare("INSERT INTO Contacts (FName, LName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $FName, $LName, $Phone, $Email, $UserID);

// Executing the insert and checking for success
if($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
} 
// If execution fails, return an error message
else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}


// Closing the statement and connection
$stmt->close();
$conn->close();

function returnWithError( $err )
{
    echo json_encode(["status"=> "error", "message"=> $err]);
}


