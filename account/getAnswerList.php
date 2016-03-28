<?php

include_once $_SERVER['DOCUMENT_ROOT'] . '/php/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/sql.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/user.php';

$key = array_key_exists('word', $_GET) ? $_GET['word'].'%' : printDefAndExit();

if (!User::getInst()->isAuthorized()) printDefAndExit();

$sql = SQL::getInst();

$result = $sql->query("SELECT id, name FROM products WHERE name LIKE ':word' LIMIT 10",[
		["name" => ":word", "val" => $key, "type" => SQL::PARAM_STR]
]);

$list = [];
if (!empty($result)) foreach ($result as $row) {
	$list[] = ["id" => $row['id'], "value" => $row['name']];
}

echo json_encode(["answers" => $list]);

//$data = file_get_contents(__DIR__ . "/answerList.json");

//echo $data;

function printDefAndExit() {
	echo json_encode([]);
	exit;
}