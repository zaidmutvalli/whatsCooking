<?php

session_start();


$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = (preg_match('/^http:\/\/localhost:\d+$/', $origin)) ? $origin : '';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");



include "db.php";

if (mysqli_connect_errno()) {
    exit('Failed to connect to MySQL');
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);


$userId  = $data['userId'] ?? null;
$restaurant_name=$data['restaurantName'] ?? null;
$rating = $data['rating'] ?? null;
$title  = $data['title'] ?? null;
$reviewText = $data['reviewText'] ?? null;


if(!$userId || !$restaurant_name || !$rating || !$title || !$reviewText) {
    echo json_encode(["status" => "error", "message" => "Please fill all fields"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    date_default_timezone_set("Europe/London");
    $created_at = date("Y-m-d H:i:s");
    

    

    if ($stmt = $con->prepare('INSERT INTO reviews (user_id,restaurant_name,rating,title,review_text,created_at) VALUES (?, ?, ?, ?, ?, ?)')) {
        $stmt->bind_param('isisss', $userId, $restaurant_name, $rating, $title, $reviewText,$created_at);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Submission succesfull"]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "failed, please try again"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $con->error]);
    }

    $stmt->close();
    $con->close();
    exit;

}






?>