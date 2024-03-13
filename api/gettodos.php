<?php
include 'connection.php';

$todo_id = $_GET('todo_id');
$user_id = $_GET('user_id');

$query = $mysqli->prepare('SELECT * FROM todos WHERE id=? AND user_id=?');
$query->bind_param('ii', $todo_id, $user_id);
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
}
echo json_encode($response);
