<?php
    ini_set("display_errors", 1);
    error_reporting(E_ALL);
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
        exit(); // Ensure the script stops executing after sending the response
    }

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}