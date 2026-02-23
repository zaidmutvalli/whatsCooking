<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require 'db.php';

$user_id = isset($_SESSION['account_id']) ? $_SESSION['account_id'] : 1;

// Get IDs of people this user follows
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

// Get friends' reviews
$stmt = $con->prepare("
    SELECT r.restaurant_name, r.rating, r.review_text, r.title, r.created_at,
           u.username
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.user_id IN ($placeholders)
    ORDER BY r.created_at DESC
    LIMIT 20
");
$stmt->bind_param($types, ...$friend_ids);
$stmt->execute();
$reviews = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Get friends' visited places
$stmt = $con->prepare("
    SELECT rv.restaurant_name, rv.restaurant_id, rv.viewed_at,
           u.username
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
    "status" => "success",
    "reviews" => $reviews,
    "visits" => $visits
]);
?>