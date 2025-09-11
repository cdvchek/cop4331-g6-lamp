<?php
include('./util.php');
require_once __DIR__ . '/db.php';
$inData = getRequestInfo();

$FName = $inData["FName"];
$LName = $inData["LName"];
$id = $inData["UserID"];


$conn = get_db_connection();

if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    // ID auto-generates, so leave it out
    $FName = "%".$FName."%";
    $LName = "%".$LName."%";
    $stmt = $conn->prepare('SELECT FName, LName, Phone, Email FROM Contacts WHERE UserID = ? AND (FName LIKE ? OR LName LIKE ?)');
    $stmt->bind_param("iss", $id,  $FName, $LName);
    if(!$stmt->execute()) {
        sendResultInfoAsJson(json_encode(["status" => "error", "message" => $conn->error]));
    }

    $result = $stmt->get_result();

    $results = [];   // <--- initialize here

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $results[] = $row;
        }
    }
    
    sendResultInfoAsJson(json_encode(["status" => "success", "data" => $results]));
      
    $stmt->close();
    $conn->close();
}
function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>


