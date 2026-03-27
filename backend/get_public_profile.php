<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : null;

if (!$userId) {
    echo json_encode(["status" => "error", "message" => "No user ID provided"]);
    exit;
}

// Get username
$stmt = $con->prepare("SELECT id, username FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

// Following
$stmt = $con->prepare("SELECT u.id, u.username FROM friendships f JOIN users u ON u.id = f.friend_id WHERE f.user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$following = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Followers
$stmt = $con->prepare("SELECT u.id, u.username FROM friendships f JOIN users u ON u.id = f.user_id WHERE f.friend_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$followers = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Reviews
$stmt = $con->prepare("SELECT id, restaurant_name, rating, title, review_text, created_at FROM reviews WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$reviews = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$con->close();

echo json_encode([
    "status"          => "success",
    "user"            => $user,
    "following_count" => count($following),
    "followers_count" => count($followers),
    "following"       => $following,
    "followers"       => $followers,
    "reviews"         => $reviews
]);
?>
