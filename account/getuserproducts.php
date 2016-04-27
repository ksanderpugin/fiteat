<?php

    include_once "../php/basic.php";
    include_once "../php/config.php";
    include_once "../php/sql.php";
    include_once "../php/user.php";
    
    if (!User::getInst()->isAuthorized()) exit;
    
    header("Content-Type: application/json");
    
//     include 'userProducts.json';
//     exit;

    $user_info = User::getInst()->getUserInfo();
    
    $favorite = strlen($user_info['favorite_list']) > 0 ? explode(',',$user_info['favorite_list']) : [];
    $black = strlen($user_info['black_list']) > 0 ? explode(',', $user_info['black_list']) : [];
    
    if (empty($favorite) && empty($black)) {
    	echo '{"favorite":[],"black":[]}';
    	exit;
    }
    
    $sql = SQL::getInst();
    
    $ids = '';
    if (strlen($user_info['favorite_list']) == 0) $ids = $user_info['black_list'];
    elseif (strlen($user_info['black_list']) == 0) $ids = $user_info['favorite_list'];
    else $ids = $user_info['favorite_list'] . ',' . $user_info['black_list'];
    
    $products = $sql->query("SELECT id, name FROM products WHERE id IN (:ids)",[
    	[
    		"name" => ":ids",
    		"val" => $ids,
    		"type" => SQL::PARAM_STR
    	]
    ]);
    
    $fjs = [];
    $bjs = [];
    
    foreach ($products as $product) {
    	if (in_array($product['id'], $favorite))
    		$fjs[] = ['productID' => $product['id'], 'productName' => $product['name']];
    	if (in_array($product['id'], $black))
    		$bjs[] = ['productID' => $product['id'], 'productName' => $product['name']];
    }
    
    echo json_encode([
    	'favorite' => $fjs,
    	'black' => $bjs
    ]);