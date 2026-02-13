<?php

$allowedOrigin = "http://localhost:5173";

header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


session_start();

include "db.php";

if (mysqli_connect_errno()) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$user_input = $data['username'] ?? null;
$pass_input = $data['password'] ?? null;

if (!$user_input || !$pass_input) {
    echo json_encode(["status" => "error", "message" => "Please fill both username and password"]);
    exit;
}

if ($stmt = $con->prepare('SELECT id, password from users where username = ?')) {
    $stmt->bind_param('s', $user_input);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        if (password_verify($pass_input, $hashed_password)) {
            session_regenerate_id();

            $_SESSION['account_loggedin'] = TRUE;
            $_SESSION['account_name'] = $user_input;
            $_SESSION['account_id'] = $id;

            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => [
                    "id" => $id,
                    "username" => $user_input
                ]
            ]);
            exit;
        }
        else {
            echo json_encode(["status" => "error", "message" => "Incorrect password"]);
        }

    }
    else {
        echo json_encode(["status" => "error", "message" => "Username not found"]);
    }
    $stmt->close();
}
else {
    echo json_encode(["status" => "error", "message" => "Database query error"]);
}

?>
