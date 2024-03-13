<?php
include 'connection.php';

$user_id = $_GET['user_id'];

$query = $mysqli->prepare('SELECT * FROM todos WHERE user_id=?');
$query->bind_param('i', $user_id);
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if ($num_rows > 0) {
    $todos = [];
    $query->bind_result($todo_id, $todo_description, $user_id);
    while ($query->fetch()) {
        $todo = [
            'id' => $todo_id,
            'description' => $todo_description,
            'user_id' => $user_id,
        ];
        $todos[] = $todo;
    }
    $response['Status'] = 'Success';
    $response['Todos'] = $todos;
} else {
    $response['Status'] = 'Failed';
    $response['Message'] = 'No todos found';
}
echo json_encode($response);
