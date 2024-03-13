<?php
include ('connection.php');

$todo_id = $_POST['todo_id'];
$todo_description = $_POST['todo_description'];

$find_id = $mysqli->prepare('SELECT * FROM todos WHERE id=?');
$find_id->bind_param('i',$todo_id);
$find_id->execute();
$find_id->store_result();

if($find_id->num_rows === 0) {
    $response['Status'] = 'Failed';
    $response['Message'] = "Invalid Id $todo_id";
} else {

    $query = $mysqli->prepare('UPDATE todos SET description=? WHERE id=?');
    $query->bind_param('si', $todo_description, $todo_id);
    $query->execute();
    
    $response['Status'] = 'Success';
    $response['Message'] = 'Todo updated successfully';    
}
echo json_encode($response);