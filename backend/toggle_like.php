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
$type     = $data['type'] ?? null;

if (!$reviewId || !in_array($type, ['like', 'dislike'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$userId = $_SESSION['account_id'];

// Check existing vote
$stmt = $con->prepare("SELECT id, type FROM post_likes WHERE review_id = ? AND user_id = ?");
$stmt->bind_param("ii", $reviewId, $userId);
$stmt->execute();
$existing = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$existing) {
    // No vote yet — insert
    $stmt = $con->prepare("INSERT INTO post_likes (review_id, user_id, type) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $reviewId, $userId, $type);
    $stmt->execute();
    $stmt->close();
    $userVote = $type;
} elseif ($existing['type'] === $type) {
    // Same vote — toggle off
    $stmt = $con->prepare("DELETE FROM post_likes WHERE review_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $reviewId, $userId);
    $stmt->execute();
    $stmt->close();
    $userVote = null;
} else {
    // Different vote — switch
    $stmt = $con->prepare("UPDATE post_likes SET type = ? WHERE review_id = ? AND user_id = ?");
    $stmt->bind_param("sii", $type, $reviewId, $userId);
    $stmt->execute();
    $stmt->close();
    $userVote = $type;
}

// Return updated counts
$stmt = $con->prepare("
    SELECT
        SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS like_count,
        SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count
    FROM post_likes WHERE review_id = ?
");
$stmt->bind_param("i", $reviewId);
$stmt->execute();
$counts = $stmt->get_result()->fetch_assoc();
$stmt->close();
$con->close();

echo json_encode([
    "status"        => "success",
    "like_count"    => (int)($counts['like_count'] ?? 0),
    "dislike_count" => (int)($counts['dislike_count'] ?? 0),
    "user_vote"     => $userVote
]);
?>
