<?php

$allowedOrigin = "http://localhost:5173";

header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


session_start();

// Verify the database connection succeeded
if (mysqli_connect_errno()) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

if(isset($_SESSION["account_loggedin"]) && $_SESSION["account_loggedin"]){
    echo json_encode([
        "status" => "success",
        "user" => [
            "username" => $_SESSION['account_name'],
            "id"       => $_SESSION['account_id']
        ]
    ]);
}

else{
    echo json_encode(["status" => "error", "message" => "No current user logged in"]);
}

?>
