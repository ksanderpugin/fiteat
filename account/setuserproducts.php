<?php

$list_type = array_key_exists('list', $_GET) ? $_GET['list'] : exit;
if ($list_type != 'favorite' && $list_type != 'black') exit;

$data = array_key_exists('json', $_POST) ? json_decode($_POST['json'],true) : exit;

include_once "../php/basic.php";
include_once "../php/config.php";
include_once "../php/sql.php";
include_once "../php/user.php";
header("Content-Type: application/json");

$cellname = $list_type . '_list';
$arr_str = '';

$user_info = User::getInst()->getUserInfo();

$sql = SQL::getInst();
$renum = [];

if (!empty($data['products'])) foreach ($data['products'] as $product) {
	if ($product['productID'] < 0) {

		$result = $sql->query("SELECT id FROM products WHERE name = ':name'", [
			[
				"name" => ":name",
				"val" => $product['productName'],
				"type" => SQL::PARAM_STR
			]
		]);

		$id = 0;

		if (!empty($result)) $id = $result[0]['id'];
		else {

			$sql->execute("INSERT INTO products (name, uid) VALUE (':name', :uid)", [
					[
							"name" => ":name",
							"val" => $product['productName'],
							"type" => SQL::PARAM_STR
					],
					[
							"name" => ":uid",
							"val" => $user_info['id'],
							"type" => SQL::PARAM_INT
					]
			]);

			$id = $sql->getInsertID();
		}

		$renum[$product['productID']] = $id;
		$arr_str .= $id.',';

	} else $arr_str .= $product['productID'].',';
}

if (strlen($arr_str) > 0) $arr_str = substr($arr_str, 0, -1);
$sql->execute("UPDATE users SET $cellname = ':val' WHERE id = :id", [
		[
				"name" => ":val",
				"val" => $arr_str,
				"type" => SQL::PARAM_STR
		],
		[
				"name" => ":id",
				"val" => $user_info['id'],
				"type" => SQL::PARAM_INT
		]
]);

echo json_encode($renum);
