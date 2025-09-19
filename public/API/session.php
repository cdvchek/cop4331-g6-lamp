<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

// Function to respond with Json and exit
function respond($statusCode, $arr){
    http_response_code($statusCode);
    echo json_encode($arr);
    exit();
}

// Check if user session exists
if(isset($_SESSION['user_id'])){
    // If Session Exists --> logged in
    respond(200, [
        "status" => "success",
        "message" => "User is logged in",
        "UserID" => $_SESSION["user_id"],
        "firstName" => $_SESSION['first_name'] ?? null,
        "lastName" => $_SESSION['last_name'] ?? null
    ]);
}
else{
    // There Is NO Session -> not authorized
    respond(200, [
        'status'=> 'error',
        'message'=> 'Unauthorized, no active session'
    ]);
    
}