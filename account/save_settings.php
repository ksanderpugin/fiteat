<?php
include_once "../php/basic.php";
include_once "../php/config.php";
include_once "../php/sql.php";
include_once "../php/user.php";

$user = User::getInst();

if (!$user->isAuthorized()) {
    echo json_encode(["state" => false]);
    exit;
}

$new_user_data = [];
$birthday = [];
$json = array_key_exists("json", $_POST) ? json_decode($_POST["json"],true) : exit;

foreach ($json as $row) {
    $new_user_data[$row["name"]] = $row["value"];
}

if (array_key_exists("calculate_calories",$new_user_data)) {
    $norm = ceil(
        getNormHB($new_user_data["height"], $new_user_data["weight"], (int)date('Y') - $new_user_data["year"], $new_user_data["gender"]) *
        User::getNormCoefficient($new_user_data["lifestyle"]));

    $new_user_data["calories"] = $norm - $norm%10;
}

if (array_key_exists("calculate_balance",$new_user_data)) {
    $new_user_data["proteins"] = 30;
    $new_user_data["fats"] = 20;
    $new_user_data["carbohydrates"] = 50;
}

if (!$user->updateUserSettings($new_user_data)) {
    echo json_encode([
        "state" => false
    ]);
	//write LOG
    exit;
}

echo json_encode([
    "state" => true,
    "calories" => $new_user_data["calories"],
    "proteins" => $new_user_data["proteins"],
    "fats" => $new_user_data["fats"],
    "carbohydrates" => $new_user_data["carbohydrates"]
]);

function getNormHB($growth,$weight,$old,$sex) {

    switch ($sex) {

        case User::SEX_MALE:
            return 88.36 + 13.4*$weight + 4.8*$growth - 5.7*$old;

        default:
            return 447.6 + 9.2*$weight + 3.1*$growth - 4.3*$old;
    }

}

function getNormMD($growth,$weight,$old,$sex) {

    $norm = 9.99*$weight + 6.25*$growth - 4.92*$old;

    switch ($sex) {

        case User::SEX_MALE:
            return $norm + 5;

        default:
            return $norm - 161;
    }
}