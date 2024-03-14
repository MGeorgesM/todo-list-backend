<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'connection.php';

$loginInput = $_POST['login'];
$password = $_POST['password'];

$query = $mysqli->prepare('SELECT id,username,score,password FROM users WHERE username=? OR email=?');
$query->bind_param('ss', $loginInput, $loginInput);
$query->execute();
$query->store_result();
$query->bind_result($id, $username, $score, $hashed_password);
$query->fetch();
$num_rows = $query->num_rows();

if ($num_rows > 0) {
    if (password_verify($password, $hashed_password)) {
        $response['Status'] = 'Logged In';
        $response['User_Id'] = $id;
        $response['Username'] = $username;
        $response['Score'] = $score;
        $response['LoggedIn'] = true;
    } else {
        $response['Message'] = 'Incorrect Username or Password';
        $response['LoggedIn'] = false;
    }
} else {
    $response['Message'] = 'Username Not Found!';
    $response['LoggedIn'] = false;
}

echo json_encode($response);
