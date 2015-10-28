<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Admin Products</title>
    <style>
        body {margin: 0; padding: 0}
        div.groups {
            position: absolute;
            width: 30%;
            height: 100%;
            overflow: auto;
            border-right: 1px #555555 solid;
        }
        div.groups > h2 {
            display: block;
            margin: 0;
            padding: 0.5em 1em;
            background-color: #555555;
            color: #ffffff;
        }
        div.groups > p {
            display: block;
            margin: 0;
            padding: 0;
        }
        div.groups > p > a {
            display: block;
            margin: 0;
            padding: 0.5em 1em;
            text-decoration: none;

        }
        div.add_group {
            padding: 0.5em 1em;
            border-bottom: 1px #555555 solid;
        }
        iframe {
            position: absolute;
            width: 68%;
            height: 100%;
            top: 0;
            left: 31%;
            border: none;
        }
    </style>
</head>
<body>
<div class="groups">
    <h2>Группы продуктов</h2>
    <div class="add_group">
        <form method="post">
            <input type="text" placeholder="Новая группа" name="group">
            <input type="text" name="action" value="add_group" style="display: none">
            <button>+</button>
        </form>
    </div>
    <p>
    <?php foreach ($groups as $row) : ?>
    <a href="/admin/products.php?action=show_group&gid=<?=$row["id"]?>" target="product_frame"><?=$row["name"]?></a>
    <?php endforeach ?>
    </p>
</div>
<iframe name="product_frame"></iframe>
</body>
</html>