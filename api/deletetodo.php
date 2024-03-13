<?php
include 'connection.php';

$todo_id = $_POST['todo_id'];

$query = $mysqli->prepare('SELECT * FROM todos WHERE id =?');
$query->bind_param('i', $todo_id);
$query->execute();
$query->store_result();
$todo_found = $query->num_rows();


if ($todo_found > 0) {
    $delete_query = $mysqli->prepare('DELETE FROM todos WHERE id =?');
    $delete_query->bind_param('i', $todo_id);
    $delete_query->execute();
    $response['Status'] = 'Deleting';
    $response['Message'] = "Todo id $todo_id was deleted successfully";
} else {
    $response['Status'] = 'Error deleting';
    $response['Message'] = "$todo_id was not found";
}
echo json_encode($response);
