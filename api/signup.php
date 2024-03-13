<?php
include 'connection.php';

$username = $_POST('username');
$email = $_POST('email');
$password = $_POST('password');

$check_email = $mysqli->prepare('SELECT email FROM users WHERE email=?');
$check_email->bind_param('s', $email);
$check_email->execute();
$check_email->store_result();
$email_exists = $check_email->num_rows();

if ($email_exists > 0) {
    $response['Status'] = 'Email already exists';
    $response['Message'] = 'User $username Was Not Created!';
} else {
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $query = $mysqli->prepare('INSER INTO users(username,email,password) VALUES(?,?,?)');
    $query->bind_param('sss', $username, $email, $hashed_password);
    $query->execute();
    $response['Status'] = 'Success!';
    $response['Message'] = "User $username Was Created Successfully";
}
echo json_encode($response);
