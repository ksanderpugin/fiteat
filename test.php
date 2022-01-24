<?php

include "php/config.php";
include "php/sql.php";

$word = array_key_exists("word", $_GET) ? $_GET['word'] : "";

$results = [];

if ($word) {
	$results = SQL::getInst()->query("SELECT * FROM products WHERE name LIKE '%$word%'");
}

$test = "test git pub";

?><!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style type="text/css">
table {border-collapse: collapse;}
td {
	padding: 0.5em 1em;
	border: 1px #000 solid;
}
</style>
</head>

<body>

<form method="get">
<input type="text" name="word" value="<?=$word?>">
<button>submit</button>
</form>

<h1>Results:</h1>

<?php if (!empty($results)) : ?>
<table>
	<thead>
	<tr>
		<th>id</th>
		<th>name</th>
		<th>Б</th>
		<th>Ж</th>
		<th>У</th>
		<th>Ккал</th>
	</tr>
	</thead>
	<tbody>
	<?php foreach ($results as $row) :?>
	<tr>
		<td><?=$row['id']?></td>
		<td><?=$row['name']?></td>
		<td><?=$row['protein']?></td>
		<td><?=$row['fat']?></td>
		<td><?=$row['carb']?></td>
		<td><?=$row['cal']?></td>
	</tr>
	<?php endforeach; ?>
	</tbody>
</table>
<?php else :?>
<p>NO RESULTS</p>
<?php endif; ?>

<h2>Navigator:</h2>
<script>
	document.write( navigator.userAgent + '</br>');
	document.write( 'Platform: ' + navigator.platform + '</br>');
	document.write( 'Product: ' + navigator.product + '</br>');
	document.write( 'Vendor: ' + navigator.vendor + '</br>');
	console.log( navigator );
</script>
	
</body>
</html>
