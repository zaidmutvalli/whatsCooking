<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require 'db.php';

$user_id = isset($_SESSION['account_id']) ? $_SESSION['account_id'] : 1;
$data = json_decode(file_get_contents("php://input"), true);
$friend_id = $data['friend_id'] ?? null;

if (!$friend_id || $friend_id == $user_id) {
    echo json_encode(["status" => "error", "message" => "Invalid friend_id"]);
    exit();
}

// Check if already following
$stmt = $con->prepare("SELECT id FROM friendships WHERE user_id = ? AND friend_id = ?");
$stmt->bind_param("ii", $user_id, $friend_id);
$stmt->execute();
$exists = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($exists) {
    // Unfollow
    $stmt = $con->prepare("DELETE FROM friendships WHERE user_id = ? AND friend_id = ?");
    $stmt->bind_param("ii", $user_id, $friend_id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(["status" => "success", "action" => "unfollowed"]);
} else {
    // Follow
    $stmt = $con->prepare("INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $friend_id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(["status" => "success", "action" => "followed"]);
}
?>