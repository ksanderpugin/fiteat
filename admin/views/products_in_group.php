<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Products Admin</title>
    <style>
        body {margin: 0; padding: 0}
        h1 {font-size: 1.25em; margin: 0; padding: 0.5em; text-align: center}
        div.add_product, div.prod_table {display: table}
        div.add_product {width: 100%; margin-bottom: 1em; border-bottom: 1px #aaaaaa solid}
        div.prod_table {width: 90%; margin: 0 auto}
        div.prod_row, div.prod_header {display: table-row}
        div.prod_header {background-color: #dddddd; font-weight: bold}
        p {display: table-cell; padding: 0.25em 0; text-align: center}
        p:first-child {width: 30%}
        p {border-bottom: 1px #CCCCCC solid}
        p+p {border-left: 1px #CCCCCC solid}
        input {width: 90%}
    </style>
</head>
<body>
<h1><?=$parent_name?></h1>
<div class="add_product">
    <form method="post">
        <p><input type="text" name="action" value="add_product" style="display: none">
        <input type="text" name="parent" value="<?=$parent?>" style="display: none">
        <input type="text" name="name" placeholder="Название" autofocus></p>
        <p><input type="text" name="kkal" placeholder="Каллорийность"></p>
        <p><input type="text" name="bel" placeholder="белки"></p>
        <p><input type="text" name="zhir" placeholder="жиры"></p>
        <p><input type="text" name="ugl" placeholder="углеводы"></p>
        <p><input type="text" name="sv" placeholder="вес шт"></p>
        <p><button>Добавить</button></p>
    </form>
</div>
<div class="prod_table">
    <div class="prod_header">
        <p>Продукт</p>
        <p>ккал</p>
        <p>Б</p>
        <p>Ж</p>
        <p>У</p>
    </div>
    <?php foreach ($products as $row) : ?>
    <div class="prod_row">
        <p><?=$row["name"]?></p>
        <p><?=$row["k"]?></p>
        <p><?=$row["b"]?></p>
        <p><?=$row["z"]?></p>
        <p><?=$row["u"]?></p>
    </div>
    <?php endforeach ?>
</div>
</body>
</html>