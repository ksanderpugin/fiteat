<?php

$data = array_key_exists("json", $_POST) ? json_decode($_POST["json"], true) : exit;

include_once "../php/basic.php";
include_once "../php/config.php";
include_once "../php/sql.php";
include_once "../php/user.php";
header("Content-Type: application/json");



$new_ids = [];
$user_rescipes = [];
$compositions = [];
$recalc_ids = [];

$sql = SQL::getInst();

$result = $sql->query("SELECT id, name FROM recipes WHERE uid = " . User::getInst()->getUserInfo()['id']);

if (!empty($result)) {

	foreach ($result as $row) {
		$user_rescipes[$row['id']] = $row['name'];
	}
	
	$result = $sql->query("SELECT id_r, id_p, weight FROM composition WHERE id_r IN (SELECT id FROM recipes WHERE uid = " . 
			User::getInst()->getUserInfo()['id'] . ")");
	
	foreach ($result as $row) {
		$compositions[$row['id_r'] . '-' . $row['id_p']] = $row['weight'];
	}
}

if (!empty($data["recipes"])) foreach ($data["recipes"] as $recipe) {
	
	if ($recipe["recipeID"] < 0) {
	
		if (!empty($recipe["products"])) {
			
			$sql->execute("INSERT INTO recipes (name) VALUE (':name')",[
					[
							"name" => ":name",
							"val" => $recipe["recipeName"],
							"type" => SQL::PARAM_STR
					]
			]);
			$new_ids[$recipe["recipeID"]] = $sql->getInsertID();
			$recalc_ids[$sql->getInsertID()] = true;
			
			foreach ($recipe["products"] as $product) {
				if ($product["productID"] < 0) {
					
					$result = $sql->query("SELECT id FROM products WHERE name = ':name'", [
							[
									"name" => ":name",
									"val" => $product["productName"],
									"type" => SQL::PARAM_STR
							]
					]);
					
					if (empty($result)) {
						$sql->execute("INSERT INTO products (name, uid) VALUE (':name', :uid)", [
								[
										"name" => ":name",
										"val" => $product["productName"],
										"type" => SQL::PARAM_STR
								],
								[
										"name" => ":uid",
										"val" => User::getInst()->getUserInfo()['id'],
										"type" => SQL::PARAM_INT
								]
						]);
						$new_ids[$product["productID"]] = $sql->getInsertID();
						$product["productID"] = $sql->getInsertID();
					} else {
						$new_ids[$product["productID"]] = $result[0]['id'];
						$product["productID"] = $result[0]['id'];
					}
					
				}
					
					$sql->execute("INSERT INTO composition VALUE (:id_r, :id_p, :weight)", [
							[
									"name" => ":id_r",
									"val" => $new_ids[$recipe["recipeID"]],
									"type" => SQL::PARAM_INT
							],
							[
									"name" => ":id_p",
									"val" => $product["productID"],
									"type" => SQL::PARAM_INT
							],
							[
									"name" => ":weight",
									"val" => $product["weight"],
									"type" => SQL::PARAM_INT
							]
					]);
				
			}
		}
		
	} else {
		if ($recipe["recipeName"] != $user_rescipes[$recipe["recipeID"]]) {
			$sql->execute("UPDATE recipes SET name = ':name' WHERE id = :id", [
					[
							"name" => ":name",
							"val" => $recipe["recipeName"],
							"type" => SQL::PARAM_STR
					],
					[
							"name" => ":id",
							"val" => $recipe["recipeID"],
							"type" => SQL::PARAM_INT
					]
			]);
		}
		$user_rescipes[$recipe["recipeID"]] = false;
		
		foreach ($recipe["products"] as $product) {
			if ($product["productID"] < 0) {
					
				$result = $sql->query("SELECT id FROM products WHERE name = ':name'", [
						[
								"name" => ":name",
								"val" => $product["productName"],
								"type" => SQL::PARAM_STR
						]
				]);
					
				if (empty($result)) {
					$sql->execute("INSERT INTO products (name, uid) VALUE (':name', :uid)", [
							[
									"name" => ":name",
									"val" => $product["productName"],
									"type" => SQL::PARAM_STR
							],
							[
									"name" => ":uid",
									"val" => User::getInst()->getUserInfo()['id'],
									"type" => SQL::PARAM_INT
							]
					]);
					$new_ids[$product["productID"]] = $sql->getInsertID();
					$product["productID"] = $sql->getInsertID();
				} else {
					$new_ids[$product["productID"]] = $result[0]['id'];
					$product["productID"] = $result[0]['id'];
				}
					
			}
			
			if (!array_key_exists($recipe["recipeID"] . '-' . $product["productID"], $compositions)){
				$sql->execute("INSERT INTO composition VALUE (:id_r, :id_p, :weight)", [
						[
								"name" => ":weight",
								"val" => $product["weight"],
								"type" => SQL::PARAM_INT
						],
						[
								"name" => "id_r",
								"val" => $recipe["recipeID"],
								"type" => SQL::PARAM_INT
						],
						[
								"name" => ":id_p",
								"val" => $product["productID"],
								"type" => SQL::PARAM_INT
						]
				]);
			}
			elseif ($compositions[ $recipe["recipeID"] . '-' . $product["productID"] ] != $product["weight"] ) {
				$sql->execute("UPDATE compositions SET weight = :weight WHERE id_r = :id_r AND id_p = :id_p", [
						[
								"name" => ":weight",
								"val" => $product["weight"],
								"type" => SQL::PARAM_INT
						],
						[
								"name" => "id_r",
								"val" => $recipe["recipeID"],
								"type" => SQL::PARAM_INT
						],
						[
								"name" => ":id_p",
								"val" => $product["productID"],
								"type" => SQL::PARAM_INT
						]
				]);
				$recalc_ids[$recipe["recipeID"]] = true;
			}
			
			$compositions[ $recipe["recipeID"] . '-' . $product["productID"] ] = false;
		}
	}
	
}

foreach ($user_rescipes as $key => $flag) {
	if ($flag !== false) {
		$sql->execute("DELETE FROM recipes WHERE id = $key;\nDELETE FROM composition WHERE id_r = $key;");
	}
}

foreach ($compositions as $key => $flag) {
	if ($flag !== false) {
		$ids = explode("-", $key);
		$sql->execute("DELETE FROM composition WHERE id_r = $ids[0] AND id_p = $ids[1]");
	}
}

echo json_encode($new_ids);