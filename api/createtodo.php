<?php
include 'connection.php';

$user_id = $_POST['user_id'];
$todo_description = $_POST['todo_description'];

$find_id = $mysqli->prepare('SELECT * FROM users WHERE id=?');
$find_id->bind_param('i',$user_id);
$find_id->execute();
$find_id->store_result();

if($find_id->num_rows() === 0) {
    $response['Status'] = 'Failed';
    $response['Message'] = "Invalid Id $user_id";
} else {
  
    $query = $mysqli->prepare('INSERT INTO todos(description, user_id) VALUES(?, ?)');
    $query->bind_param('si', $todo_description, $user_id);
    $query->execute();
    $response['Status'] = 'Success';
    $response['Message'] = 'Todo created successfully';
}
    
echo json_encode($response);
