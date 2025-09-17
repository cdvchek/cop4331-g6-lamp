<?php
// Includes the utility functions for JSON handling and DB connection
include('./util.php');
require_once __DIR__ . '/db.php';

// Getting the JSON input from the Client
$inData = getRequestInfo();


// Validate input existence
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

// Store the input in variables for clarity trim to remove extra spaces
$FName = trim($inData['firstName']);
$LName = trim($inData['lastName']);
$Username = trim($inData['username']);
$Password = $inData['password']; // Plain text password (will be hashed before storing)

//------------- Input validations ------------------//
// Validate name lengths to prevent excessively long entries
if (strlen($FName) > 50 || strlen($LName) > 50) {
    http_response_code(400); // Bad Request
    returnWithError("First and Last names must be 50 characters or fewer");
    exit();
}   

// Validate username length
if (strlen($Username) > 50) {
    http_response_code(400); // Bad Request
    returnWithError("Username must be 50 characters or fewer");
    exit();
}   

// Validating password strength (will add once development is done)
// $passwordPattern = '/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/'; // Minimum eight characters, at least one letter and one number
// at least one lowercase letter, one uppercase letter, one number and one special character
// if (!preg_match($passwordPattern, $Password)) {
//     http_response_code(400); // Bad Request
//     returnWithError("Password must be at least 8 characters, include at least one letter and one number");
//     exit();
// }

// should we restrict characters in username? for now we will allow any characters

//------------- End Input validations ------------------//


// Connect to the database
$conn = get_db_connection();
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    returnWithError($conn->connect_error);
    exit();
}

// Check if username already exists
$stmt = $conn->prepare("SELECT 1 FROM Users WHERE BINARY Username = ? LIMIT 1");
$stmt->bind_param("s", $Username);
if (!$stmt->execute()) {
    if ($conn->errno === 1062) {
        http_response_code(409);
        returnWithError("Username already taken");
    }
}
$result = $stmt->get_result();
$stmt->close();

// Hashing the password before storing
$hashedPassword = password_hash($Password, PASSWORD_DEFAULT);
// PASSWORD_DEFAULT uses the bcrypt algorithm by default


// Inserting new user into the database
$insertStmt = $conn->prepare("INSERT INTO Users (FName, LName, Username, Password) VALUES (?, ?, ?, ?)");


// Check if prepare was successful
if (!$insertStmt) {
    http_response_code(500); // Internal Server Error
    returnWithError("Prepare failed: " . $conn->error);
    exit();
}

$insertStmt->bind_param("ssss", $FName, $LName, $Username, $hashedPassword);

// Executing the insert and checking for success
if ($insertStmt->execute()) {
    // Success: returns the new user's info via POST
    http_response_code(201); // Created successfully registered
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
