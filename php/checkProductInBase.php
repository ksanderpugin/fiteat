<?php

include "../php/config.php";
include "../php/sql.php";

$word = array_key_exists("word", $_GET) ? $_GET['word'] : "";

$results = [];

if ($word) {
	$results = SQL::getInst()->query("SELECT * FROM products WHERE name LIKE '%$word%'");
}

?>

<?php if (!empty($results)) : ?>
    <tbody>
  	<?php foreach ($results as $row) :?>
  	<tr>
  		<td><?=$row['id']?></td>
  		<td><?=$row['name']?></td>
  	</tr>
  	<?php endforeach; ?>
  	</tbody>
<?php else :?>
  <p>NO RESULTS</p>
<?php endif; ?>
