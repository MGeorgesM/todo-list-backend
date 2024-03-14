<?php
include 'connection.php';

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

$check_email = $mysqli->prepare('SELECT email FROM users WHERE email=?');
$check_email->bind_param('s', $email);
$check_email->execute();
$check_email->store_result();
$email_exists = $check_email->num_rows();

$check_username = $mysqli->prepare('SELECT username FROM users WHERE username=?');
$check_username->bind_param('s', $username);
$check_username->execute();
$check_username->store_result();
$username_exists = $check_username->num_rows();

if ($email_exists > 0) {
    http_response_code(409);
    $response['Message'] = "Email $email already exists!";
} elseif ($username_exists > 0) {
    http_response_code(409);
    $response['Message'] = "Username $username already exists!";
} else {
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $query = $mysqli->prepare('INSERT INTO users(username,email,password) VALUES(?,?,?)');
    $query->bind_param('sss', $username, $email, $hashed_password);
    $query->execute();
    $response['Message'] = "User $username Was Created Successfully";
}
echo json_encode($response);
