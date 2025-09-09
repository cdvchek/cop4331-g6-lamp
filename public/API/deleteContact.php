<?php
include('./util.php');
require_once __DIR__ . '/db.php';

$inData = getRequestInfo();

// Check that input exists
if (!$inData) {
    http_response_code(404); // Not Found
    returnWithError("No input data");
    exit();
}

// Check required fields
if (!isset($inData["UserID"]) || !isset($inData["ContactID"])) {
    http_response_code(400); // Bad Request
    returnWithError("Missing UserID or ContactID");
    exit();
}

$UserID = $inData["UserID"];
$ContactID = $inData["ContactID"];

// Database connection
$conn = get_db_connection();

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    returnWithError($conn->connect_error);
    exit();
}

// Prepare DELETE statement to remove only the specific contact for this user
$stmt = $conn->prepare("DELETE FROM Contacts WHERE ContactID = ? AND UserID = ?");
$stmt->bind_param("ii", $ContactID, $UserID);

// Execute and return response
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Contact deleted"]);
    } else {
        http_response_code(404); // Not Found
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