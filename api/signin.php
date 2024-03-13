<?php
include 'connection.php';

$loginInput = $_POST['login'];
$password = $_POST['password'];

$query = $mysqli->prepare('SELECT id,username,password FROM users WHERE username=? OR email=?');
$query->bind_param('ss', $loginInput, $loginInput);
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
        $response['Login'] = true;
    } else {
        $response['Message'] = 'Incorrect Username or Password';
        $response['Login'] = false;
    }
} else {
    $response['Message'] = 'Username Not Found!';
    $response['Login'] = false;
}

echo json_encode($response);
