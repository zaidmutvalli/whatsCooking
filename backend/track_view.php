<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

$user_id = $_SESSION['account_id'] ?? 1;
$data = json_decode(file_get_contents("php://input"), true);

$rid  = $data['restaurant_id'] ?? null;
$name = $data['restaurant_name'] ?? null;

if (!$rid || !$name) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit();
}

// updates your time time if place is already visited, otherwise insert
$stmt = $con->prepare("
    INSERT INTO recent_views (user_id, restaurant_id, restaurant_name, viewed_at)
    VALUES (?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE viewed_at = NOW(), restaurant_name = ?
");
$stmt->bind_param("isss", $user_id, $rid, $name, $name);
$stmt->execute();
$stmt->close();

echo json_encode(["status" => "success"]);
?>