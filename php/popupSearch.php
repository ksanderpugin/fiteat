<?php
/*
include_once $_SERVER['DOCUMENT_ROOT'].'/cart/db.class.php';
$db=new DB;
$q="SELECT * FROM products WHERE name LIKE '".iconv('UTF-8', 'cp1251', $_POST['word'])."%'";
$result=$db->fetch_all($db->query($q));
if (!empty($result)) {
	foreach ($result as $product){
		echo '<p onclick="$(\'#search_field\').val($(this).html())">'.$product['name'].'</p>';
	}
}*/

echo '<p onclick="$(\'#search_field\').val($(this).html())">Совесть Цезаря</p>';
echo '<p onclick="$(\'#search_field\').val($(this).html())">Милые кости</p>';
echo '<p onclick="$(\'#search_field\').val($(this).html())">Котлеты без мяса</p>';
echo '<p onclick="$(\'#search_field\').val($(this).html())">Нога Обамы</p>';