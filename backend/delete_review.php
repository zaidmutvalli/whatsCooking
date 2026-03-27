<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

$data = json_decode(file_get_contents('php://input'), true);
$reviewId = $data['reviewId'] ?? null;

if (!$reviewId) {
    echo json_encode(["status" => "error", "message" => "No review ID provided"]);
    exit;
}

$userId = $_SESSION['account_id'];

$stmt = $con->prepare('DELETE FROM reviews WHERE id = ? AND user_id = ?');
$stmt->bind_param('ii', $reviewId, $userId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Review deleted"]);
} else {
    echo json_encode(["status" => "error", "message" => "Review not found or not yours"]);
}

$stmt->close();
$con->close();
?>
