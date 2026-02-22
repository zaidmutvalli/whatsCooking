<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require "db.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['token'])) {
        echo json_encode(["status" => "error", "message" => "Invalid Token"]);
        exit;
    } else {
        $token = $_GET['token'];
    }
    $stmt = $con->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows !== 1) {
        echo json_encode(["status" => "error", "message" => "Invalid or Expired Token."]);
    } else {
        echo json_encode(["status" => "success", "message" => "Valid token"]);
    }

    exit;
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $token = $data['token'] ?? null;
    $password = $data['password'] ?? null;
    $confirm = $data['confirm'] ?? null;

    if (!$token || !$password || !$confirm) {
        echo json_encode(["status" => "error", "message" => "Token and Password are Required."]);
        exit;
    }

    if ($password !== $confirm) {
        echo json_encode(["status" => "error", "message" => "Password does not match."]);
        exit;
    }

    $newPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $con->prepare(
        "UPDATE users
        SET password = ?, reset_token = NULL, reset_expires = NULL
        WHERE reset_token = ? AND reset_expires > NOW()"
    );

    $stmt->bind_param("ss", $newPassword, $token);
    
    
    $stmt->execute();
    if ($stmt->affected_rows === 1) {
        echo json_encode(["status" => "success", "message" => "Password updated successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
    }


    exit;
}

?>
