<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

if (!isset($_SESSION['account_loggedin']) || !$_SESSION['account_loggedin']) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

require 'db.php';

$data     = json_decode(file_get_contents('php://input'), true);
$reviewId = $data['reviewId'] ?? null;
$comment  = trim($data['comment'] ?? '');

if (!$reviewId || $comment === '') {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$userId   = $_SESSION['account_id'];
$username = $_SESSION['account_name'];
date_default_timezone_set('Europe/London');
$createdAt = date("Y-m-d H:i:s");

$stmt = $con->prepare("INSERT INTO post_comments (review_id, user_id, username, comment_text, created_at) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iisss", $reviewId, $userId, $username, $comment, $createdAt);
$stmt->execute();
$newId = $stmt->insert_id;
$stmt->close();
$con->close();

echo json_encode([
    "status"  => "success",
    "comment" => [
        "id"           => $newId,
        "username"     => $username,
        "comment_text" => $comment,
        "created_at"   => $createdAt
    ]
]);
?>
