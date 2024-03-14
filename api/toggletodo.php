<?php
include 'connection.php';

$todo_id = $_POST['todo_id'];
$todo_ischecked = $_POST['is_checked'];

$get_todo = $mysqli->prepare('SELECT * FROM todos WHERE id=?');
$get_todo->bind_param('i', $todo_id);
$get_todo->execute();
$get_todo->store_result();

if ($get_todo->num_rows === 0) {
    $response['Status'] = 'Error';
    $response['Message'] = "Todo $todo_id is not found";
} else {
    $mark_todo = $mysqli->prepare('UPDATE todos SET complete=? WHERE id=?');
    $mark_todo->bind_param('si', $todo_ischecked, $todo_id);
    $mark_todo->execute();
    if ($todo_ischecked) {
        $adjust_score = $mysqli->prepare(
            'UPDATE users JOIN todos ON users.id = todos.user_id SET users.score = CASE WHEN ? THEN users.score + 1 ELSE users.score - 1 END WHERE todos.id = ?'
        );
        $adjust_score->bind_param('si', $todo_ischecked, $todo_id);
        $adjust_score->execute();
        $adjust_todo = $mysqli->prepare('UPDATE todos SET complete = CASE WHEN ? 1 ELSE 0 END WHERE id =?');
        $adjust_todo->bind_param('si',$todo_ischecked,$todo_id);
        $adjust_todo->execute();

        $response['Status'] = 'Todo complete toggled';
        $response['Complete'] = $todo_ischecked;
    }
}

echo json_encode($response);