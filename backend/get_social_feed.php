<?php
session_start();
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require 'db.php';

$user_id = $_SESSION['account_id'] ?? 1;

$stmt = $con->prepare("SELECT friend_id FROM friendships WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$friend_ids = [];
while ($row = $result->fetch_assoc()) {
    $friend_ids[] = $row['friend_id'];
}
$stmt->close();

if (empty($friend_ids)) {
    echo json_encode(["status" => "no_friends", "reviews" => [], "visits" => []]);
    exit();
}

$placeholders = implode(',', array_fill(0, count($friend_ids), '?'));
$types = str_repeat('i', count($friend_ids));

// Get friends' reviews with like/dislike counts, user vote, comment count
$stmt = $con->prepare("
    SELECT r.id AS review_id, r.restaurant_name, r.rating, r.review_text, r.title, r.created_at,
           u.username, u.id AS user_id,
           SUM(CASE WHEN pl.type = 'like' THEN 1 ELSE 0 END) AS like_count,
           SUM(CASE WHEN pl.type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count,
           MAX(CASE WHEN pl.user_id = ? THEN pl.type ELSE NULL END) AS user_vote,
           COUNT(DISTINCT pc.id) AS comment_count
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    LEFT JOIN post_likes pl ON pl.review_id = r.id
    LEFT JOIN post_comments pc ON pc.review_id = r.id
    WHERE r.user_id IN ($placeholders)
    GROUP BY r.id
    ORDER BY r.created_at DESC
    LIMIT 20
");
$stmt->bind_param("i" . $types, $user_id, ...$friend_ids);
$stmt->execute();
$reviews = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$stmt = $con->prepare("
    SELECT rv.restaurant_name, rv.restaurant_id, rv.viewed_at,
           u.username, u.id AS user_id
    FROM recent_views rv
    JOIN users u ON u.id = rv.user_id
    WHERE rv.user_id IN ($placeholders)
    ORDER BY rv.viewed_at DESC
    LIMIT 20
");
$stmt->bind_param($types, ...$friend_ids);
$stmt->execute();
$visits = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode([
    "status"  => "success",
    "reviews" => $reviews,
    "visits"  => $visits
]);
?>
