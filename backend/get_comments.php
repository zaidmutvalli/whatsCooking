<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require 'db.php';

$reviewId = isset($_GET['reviewId']) ? (int)$_GET['reviewId'] : null;

if (!$reviewId) {
    echo json_encode(["status" => "error", "message" => "No review ID"]);
    exit;
}

$stmt = $con->prepare("SELECT id, user_id, username, comment_text, created_at FROM post_comments WHERE review_id = ? ORDER BY created_at ASC");
$stmt->bind_param("i", $reviewId);
$stmt->execute();
$comments = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();
$con->close();

echo json_encode(["status" => "success", "comments" => $comments]);
?>
