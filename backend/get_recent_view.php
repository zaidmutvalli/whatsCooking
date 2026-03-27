<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';

session_start();
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require 'db.php';

$user_id = $_SESSION['account_id'] ?? 1;

$stmt = $con->prepare("SELECT restaurant_name FROM recent_views WHERE user_id = ? ORDER BY viewed_at DESC LIMIT 1");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($row) {
    echo json_encode(["status" => "success", "recent_view" => $row['restaurant_name']]);
} else {
    echo json_encode(["status" => "no_views"]);
}
?>