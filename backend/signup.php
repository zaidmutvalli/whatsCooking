<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

session_start();

include "db.php";

if (mysqli_connect_errno()) {
    exit('Failed to connect to MySQL');
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$username = $data['username'] ?? null;
$email    = $data['email'] ?? null;
$password = $data['password'] ?? null;
$confirm  = $data['confirm'] ?? null;

if(!$username || !$password || !$email || !$confirm) {
    echo json_encode(["status" => "error", "message" => "Please fill all fields"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if ($password !== $confirm) {
        exit('Passwords do not match');
    }

    date_default_timezone_set("Europe/London");
    $registered = date("Y-m-d H:i:s");

    $hashed = password_hash($password, PASSWORD_DEFAULT);

    if ($stmt = $con->prepare('SELECT id FROM users WHERE username = ? OR email = ?')) {
        $stmt->bind_param('ss', $username, $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Username or email already exists"]);
            $stmt->close();
            exit;
        }
        $stmt->close();
    }

    if ($stmt = $con->prepare('INSERT INTO users (username, email, password, registered) VALUES (?, ?, ?, ?)')) {
        $stmt->bind_param('ssss', $username, $email, $hashed, $registered);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Registration successful"]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Signup failed, please try again"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $con->error]);
    }

    $stmt->close();
    $con->close();

}

?>