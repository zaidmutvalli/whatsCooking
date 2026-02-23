<?php

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

include "db.php";

if (mysqli_connect_errno()) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$restaurantName = $_GET['restaurantName'] ?? null;

if (!$restaurantName) {
    echo json_encode(["status" => "error", "message" => "No restaurant name provided"]);
    exit;
}

$stmt = $con->prepare('
    SELECT r.id, r.rating, r.title, r.review_text, r.created_at, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.restaurant_name = ?
    ORDER BY r.created_at DESC
');

$stmt->bind_param('s', $restaurantName);
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
