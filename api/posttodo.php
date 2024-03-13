<?php
include 'connection.php';

$user_id = $_POST['user_id'];
$todo_id = $_POST['todo_id'];
$todo_description = $_POST['todo_description'];

$check_existing_id = $mysqli->prepare('SELECT id FROM todos WHERE id=?');
$check_existing_id->bind_param('i', $todo_id);
$check_existing_id->execute();
$check_existing_id->store_result();
$id_exists = $check_existing_id->num_rows();

if ($id_exists > 0) {
    $response['Status'] = 'Todo already exists, overwriting changes';
    $query = $mysqli->prepare('UPDATE todos SET description=?');
    $query->bind_param('s', $todo_description);
    $query->execute();
    $response['Message'] = 'Todo $todo_id was updated successfully';
} else {
    $response['Status'] = 'Adding new todo';
    $query = $mysqli->prepare('INSERT INTO todos(id,description,user_id) VALUES(?,?,?)');
    $query->bind_param('isi', $todo_id, $todo_description, $user_id);
    $query->execute();
    $response['Message'] = 'Todo $todo_id for user id: $user_id was created';
}
echo json_encode($response);
