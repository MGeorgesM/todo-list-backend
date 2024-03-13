<?php
include 'connection.php';

$username = $_POST['username'];
$password = $_POST['password'];

$query = $mysqli->prepare(
    'SELECT id,username,password FROM users WHERE username=?'
);
$query->bind_param('s', $username);
$query->execute();
$query->store_result();
$query->bind_result($id, $username, $hashed_password);
$query->fetch();
$num_rows = $query->num_rows();

if ($num_rows > 0) {
    if (password_verify($password, $hashed_password)) {
        $response['Status'] = 'Logged In';
        $response['User_Id'] = $id;
        $response['Username'] = $username;
    } else {
        $response['Status'] = 'Incorrect Username or Password';
    }
} else {
    $response['Status'] = 'Username Not Found!';
}

echo json_encode($response);