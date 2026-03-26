<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require 'db.php';

$user_id = $_SESSION['account_id'] ?? 1;
$search = isset($_GET['q']) ? '%' . $_GET['q'] . '%' : '%';

$stmt = $con->prepare("
    SELECT u.id, u.username,
           CASE WHEN f.friend_id IS NOT NULL THEN 1 ELSE 0 END as is_following
    FROM users u
    LEFT JOIN friendships f ON f.user_id = ? AND f.friend_id = u.id
    WHERE u.id != ? AND u.username LIKE ?
    LIMIT 20
");
$stmt->bind_param("iis", $user_id, $user_id, $search);
$stmt->execute();
$users = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode(["status" => "success", "users" => $users]);
?>