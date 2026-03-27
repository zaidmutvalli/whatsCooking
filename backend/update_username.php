<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION['account_loggedin']) || !$_SESSION['account_loggedin']) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

include "db.php";

if (mysqli_connect_errno()) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$newUsername = trim($data['username'] ?? '');

if (!$newUsername) {
    echo json_encode(["status" => "error", "message" => "Username cannot be empty"]);
    exit;
}

$userId = $_SESSION['account_id'];

$stmt = $con->prepare('UPDATE users SET username = ? WHERE id = ?');
$stmt->bind_param('si', $newUsername, $userId);
$stmt->execute();

if ($stmt->affected_rows >= 0) {
    $_SESSION['account_name'] = $newUsername;
    echo json_encode(["status" => "success", "message" => "Username updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update username"]);
}

$stmt->close();
$con->close();
?>
