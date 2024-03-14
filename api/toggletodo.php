<?php
include 'connection.php';

$user_id = $_POST['user_id'];
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
    $todo_ischecked_value = $todo_ischecked === 'true' ? 1: 0;

    $mark_todo = $mysqli->prepare('UPDATE todos SET complete = CASE WHEN ? THEN 1 ELSE 0 END WHERE id = ?');
    $mark_todo->bind_param('ii', $todo_ischecked_value, $todo_id);
    $mark_todo->execute();
    $adjust_score = $mysqli->prepare(
        'UPDATE users SET users.score = CASE WHEN ? THEN users.score + 1 ELSE users.score - 1 END WHERE users.id = ?'
    );
    $adjust_score->bind_param('ii', $todo_ischecked_value, $user_id);
    $adjust_score->execute();
    $get_score = $mysqli->prepare('SELECT score FROM users WHERE id =?');
    $get_score->bind_param('i',$user_id);
    $get_score->execute();
    $get_score->store_result();
    $get_score->bind_result($score);
    $get_score->fetch();

    $response['Status'] = 'Complete';
    $response['Score'] = $score;
}

echo json_encode($response);