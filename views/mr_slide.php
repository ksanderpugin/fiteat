<?php foreach($recipes as $recipe) : ?>
<div class="mr_slide">
    <div class="mr_slide_pic" style="background-image: url(<?=$recipe['img']?>);"></div>
    <div class="mr_slide_text">
        <p class="mr_slide_name"><?=$recipe['name']?></p>
        <p>На 100 грамм: <span><?=sprintf("%.2f",$recipe['k'])?> ккал</span></p>
        <div class="mr_nutrients">
            <div class="mr_nutrients_item">
                <div class="mr_nutrients_item_top">
                    <div class="mr_nutrients_item_box" style="background-color:#ffa371;"></div>
                    <div class="mr_nutrients_item_name">Белки</div>
                    <div class="clearfix"></div>
                </div>
                <div class="mr_nutrients_item_bottom" style="color:#ffa371;"><?=sprintf("%.2f",$recipe['b'])?></div>
            </div>
            <div class="mr_nutrients_item">
                <div class="mr_nutrients_item_top">
                    <div class="mr_nutrients_item_box" style="background-color:#fff571;"></div>
                    <div class="mr_nutrients_item_name">Жиры</div>
                    <div class="clearfix"></div>
                </div>
                <div class="mr_nutrients_item_bottom" style="color:#eed406;"><?=sprintf("%.2f",$recipe['z'])?></div>
            </div>
            <div class="mr_nutrients_item">
                <div class="mr_nutrients_item_top">
                    <div class="mr_nutrients_item_box" style="background-color:#62ddb7;"></div>
                    <div class="mr_nutrients_item_name">Углеводы</div>
                    <div class="clearfix"></div>
                </div>
                <div class="mr_nutrients_item_bottom" style="color:#62ddb7;"><?=sprintf("%.2f",$recipe['u'])?></div>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="mr_icons">
            <div class="mr_icon" style="background-image:url(images/20x20_tomato.png);"></div>
            <div class="mr_icon" style="background-image:url(images/20x20_che.png);"></div>
            <div class="mr_icon" style="background-image:url(images/20x20_olive.png);"></div>
            <div class="clearfix"></div>
        </div>
        <div><a><span>+</span>добавить в меню</a></div>
        <div><a>посмотреть рецепт</a></div>
    </div>
</div>
<?php endforeach?>