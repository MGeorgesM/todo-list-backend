<?php
include('connection.php');

$username = $_POST('username');
$password = $_POST('password');

$check_username = $mysqli->prepare('SELECT email FROM users WHERE email=?');
$check_username->bind_param('s',$username);
$check_username->execute();
$check_username->store_result();
$username_exists = $check_username->num_rows();

if ($username_exists > 0) {
    $response['Status'] = 'User Already Exists';
    $response['Message'] = 'User $username Was Not Created!';
} else {
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $query = $mysqli->prepare('INSER INTO users(username,password) VALUES(?,?)');
    $query->bind_param('ss',$username,$hashed_password);
    $query->execute();
    $response['Status']='Success!';
    $response['Message']='User $username Was Created Successfully';
}
echo json_encode($response);