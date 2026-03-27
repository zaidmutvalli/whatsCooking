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

include "db.php";

if (mysqli_connect_errno()) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$userId = $_SESSION['account_id'];

$stmt = $con->prepare('
    SELECT id, restaurant_name, rating, title, review_text, created_at
    FROM reviews
    WHERE user_id = ?
    ORDER BY created_at DESC
');
$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode(["status" => "success", "reviews" => $reviews]);

$stmt->close();
$con->close();
?>
