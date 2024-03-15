<?php
include 'connection.php';

$todo_id = $_POST['todo_id'];

$query = $mysqli->prepare('SELECT complete, user_id FROM todos WHERE id =?');
$query->bind_param('i', $todo_id);
$query->execute();
$query->store_result();
$query->bind_result($complete, $user_id);
$query->fetch();
$todo_found = $query->num_rows();

if ($todo_found > 0) {
    $delete_query = $mysqli->prepare('DELETE FROM todos WHERE id =?');
    $delete_query->bind_param('i', $todo_id);
    $delete_query->execute();
    $response['Status'] = 'Deleting';
    $response['Message'] = "Todo id $todo_id was deleted successfully";

    if ($complete) {
        $adjust_score = $mysqli->prepare('UPDATE users SET score = score -1 WHERE id = ?');
        $adjust_score->bind_param('i', $user_id);
        $adjust_score->execute();
        $get_score = $mysqli->prepare('SELECT score FROM users WHERE id =?');
        $get_score->bind_param('i', $user_id);
        $get_score->execute();
        $get_score->store_result();
        $get_score->bind_result($score);
        $get_score->fetch();

        $response['Score'] = $score;
    }
} else {
    $response['Status'] = 'Error deleting';
    $response['Message'] = "$todo_id was not found";
}

echo json_encode($response);
