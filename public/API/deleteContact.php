<?php
session_start();
include('./util.php');
require_once __DIR__ . '/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status"=>"error","message"=>"You must be logged in"]);
    exit();
}

$UserID = $_SESSION['user_id'];

$inData = getRequestInfo();

// Check that ContactID was provided
if (!isset($inData["ContactID"])) {
    http_response_code(400); // Bad Request
    returnWithError("Missing ContactID");
    exit();
}


// Validating ContactID as integers
$ContactID = filter_var($inData["ContactID"], FILTER_VALIDATE_INT);

if ($ContactID === false) {
    http_response_code(400); // Bad Request
    returnWithError("ContactID must be valid integers");
    exit();
}

// Database connection
$conn = get_db_connection();

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    returnWithError($conn->connect_error);
    exit();
}

// Verify that the contact belongs to the user
$verifyStmt = $conn->prepare("SELECT ContactID FROM Contacts WHERE ContactID = ? AND UserID = ?");
$verifyStmt->bind_param("ii", $ContactID, $UserID);
$verifyStmt->execute();
$verifyResult = $verifyStmt->get_result();

if (!$verifyResult->fetch_assoc()) {
    http_response_code(404); // Not Found
    returnWithError("No contact found for this user");
    $verifyStmt->close();
    $conn->close();
    exit();
}
$verifyStmt->close();


// Prepare DELETE statement to remove only the specific contact for this user
$stmt = $conn->prepare("DELETE FROM Contacts WHERE ContactID = ? AND UserID = ?");
$stmt->bind_param("ii", $ContactID, $UserID);

// Execute and return response
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200); // OK
        echo json_encode(["status" => "success", "message" => "Contact deleted"]);
    } else {
        http_response_code(404); //not found
        echo json_encode(["status" => "error", "message" => "No contact found for this user"]);
    }
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

// Close connection
$stmt->close();
$conn->close();

function returnWithError($err) {
    echo json_encode(["status"=> "error", "message"=> $err]);
}
?>