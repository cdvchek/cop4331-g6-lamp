<?php
// Includes the utility functions for JSON handling and DB connection
include('./util.php');
require_once __DIR__ . '/db.php';

// Getting the JSON input from the Client
$inData = getRequestInfo();

// Check if input data is provided
if (!$inData) {
    http_response_code(400); // Bad Request
    returnWithError("No input data");
    exit();
}

// Validating the required fields
if (!isset($inData['firstName'], $inData['lastName'], $inData['username'], $inData['password'])) {
    http_response_code(400); // Bad Request
    returnWithError("All fields are required: firstName, lastName, username, password");
    exit();
}

// Store the input in variables for clarity
$FName = $inData['firstName'];
$LName = $inData['lastName'];
$Username = $inData['username'];
$Password = $inData['password']; // Plain text password (will be hashed before storing)

// Connect to the database
$conn = get_db_connection();
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    returnWithError($conn->connect_error);
    exit();
}

// Check if username already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Username = ?");
$stmt->bind_param("s", $Username);
$stmt->execute();
$result = $stmt->get_result();

// If Username is taken, we are returning an error
if ($result->fetch_assoc()) {
    $stmt->close();
    http_response_code(409); // Conflict
    returnWithError("Username already taken");
    exit();
}
$stmt->close();

// Hashing the password before storing
$hashedPassword = password_hash($Password, PASSWORD_DEFAULT);
// PASSWORD_DEFAULT uses the bcrypt algorithm by default


// Inserting new user into the database
$insertStmt = $conn->prepare("INSERT INTO Users (FName, LName, Username, Password) VALUES (?, ?, ?, ?)");
if (!$insertStmt) {
    http_response_code(500); // Internal Server Error
    returnWithError("Prepare failed: " . $conn->error);
    exit();
}

$insertStmt->bind_param("ssss", $FName, $LName, $Username, $hashedPassword);

// Executing the insert and checking for success
if ($insertStmt->execute()) {
    // Success: returns the new user's info via POST
    returnWithInfo($FName, $LName, $conn->insert_id);
} else {
    // Else, Something went wrong with the insert
    http_response_code(500);
    returnWithError("Failed to register user: " . $insertStmt->error);
}

// Closing the statement and connection
$insertStmt->close();
$conn->close();


// Helper functions for JSON response

// Functoin specific for register.php
function returnWithError( $err )
{
	$response = [
		"status" => "error",
		"message" => $err,
    ];
	sendResultInfoAsJson( json_encode($response) );
}

function returnWithInfo( $firstName, $lastName, $id )
{
	$response = [
		"status" => "success",
		"message" => "successfully registered",
		"data" => [
			"id" => $id,
			"firstName" => $firstName,
			"lastName" => $lastName
		]
    ];
	sendResultInfoAsJson( json_encode($response) );
}
?>
