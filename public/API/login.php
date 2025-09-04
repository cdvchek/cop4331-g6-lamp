<?php
include('./util.php');
require_once __DIR__ . '/db.php';
$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$conn = get_db_connection();
if( $conn->connect_error )
{
	returnWithError( $conn->connect_error );
	exit();
}

$stmt = $conn->prepare('SELECT Password, FName, LName, ID FROM Users WHERE Username = ?');
$stmt->bind_param('s', $inData['login']);
$stmt->execute();
$stmt->bind_result($storedHash, $firstName, $lastName, $id);

if ($stmt->fetch() && password_verify($inData['password'], $storedHash)) 
{
	returnWithInfo( $firstName, $lastName, $id);
}
else
{
	returnWithError("Incorrect Username or Password");
}

$stmt->close();
$conn->close();



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
		"message" => "successfully logged in",
		"data" => [
			"id" => $id,
			"firstName" => $firstName,
			"lastName" => $lastName
		]
    ];
	sendResultInfoAsJson( json_encode($response) );
}

?>
