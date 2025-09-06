<?php
$inData = getRequestInfo();

$FName = $inData["FName"];
$LName = $inData["LName"];
$Phone = $inData["Phone"];
$Email = $inData["Email"];
$UserID = $inData["UserID"];

$conn = get_db_connection();

if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    // ID auto-generates, so leave it out
    $stmt = $conn->prepare("INSERT INTO Contacts (FName, LName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $FName, $LName, $Phone, $Email, $UserID);
    
    if($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
    } 
    else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
    $stmt->close();
    $conn->close();
}

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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>


