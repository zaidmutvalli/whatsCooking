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

if (!isset($_SESSION['account_loggedin']) || !$_SESSION['account_loggedin']) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

require 'db.php';

$userId = $_SESSION['account_id'];

// People this user follows
$stmt = $con->prepare("SELECT u.id, u.username FROM friendships f JOIN users u ON u.id = f.friend_id WHERE f.user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$following = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// People who follow this user
$stmt = $con->prepare("SELECT u.id, u.username FROM friendships f JOIN users u ON u.id = f.user_id WHERE f.friend_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$followers = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$con->close();

echo json_encode([
    "status"           => "success",
    "following_count"  => count($following),
    "followers_count"  => count($followers),
    "following"        => $following,
    "followers"        => $followers
]);
?>
