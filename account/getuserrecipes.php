<?php

ini_set("display_errors", "Off");

include_once "../php/basic.php";
include_once "../php/config.php";
include_once "../php/sql.php";
include_once "../php/user.php";
header("Content-Type: application/json");

if (!User::getInst()->isAuthorized()) exit;

$sql = SQL::getInst();

$recipes = [];
$products = [];
$p_ids = [];
$composition = [];

$result = $sql->query("SELECT id, name FROM recipes WHERE uid = " . User::getInst()->getUserInfo()['id']);
foreach ($result as $row) {
	$recipes[$row['id']] = $row['name'];
}
$r_ids = substr(json_encode(array_keys($recipes)), 1, -1);

$result = $sql->query("SELECT * FROM composition WHERE id_r IN ($r_ids)");
foreach ($result as $row) {
	$composition[$row['id_r']][$row['id_p']] = $row['weight'];
	$p_ids[$row['id_p']] = true;
}
$p_ids_str = substr(json_encode( array_keys($p_ids) ), 1, -1);

$result = $sql->query("SELECT id, name FROM products WHERE id IN ($p_ids_str)");
foreach ($result as $row) {
	$products[$row['id']] = $row['name'];
}

$data = [];

foreach ($recipes as $recipe_id => $recipe_name) {
	$prod_t = [];
	foreach ($composition[$recipe_id] as $product_id => $weight) {
		$prod_t[] = [
				"productID" => $product_id,
				"productName" => $products[$product_id],
				"weight" => $weight
		];
	}
	$data[] = [
			"recipeID" => $recipe_id,
			"recipeName" => $recipe_name,
			"products" => $prod_t
	];
}

echo json_encode(["recipes" => $data]);

