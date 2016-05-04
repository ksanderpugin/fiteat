<?php
    include_once "../php/basic.php";
    include_once "../php/config.php";
    include_once "../php/sql.php";
    include_once "../php/user.php";

    if (!User::getInst()->isAuthorized()) {
        header("Location: http://" . $_SERVER['SERVER_NAME'] . "/account/login.php");
        exit;
    }

    $fb_url = Config::getFbUrl();
    $vk_url = Config::getVkUrl();

    $app = array_key_exists("app",$_GET);
    $header = $app ? "" : render(__DIR__."/../views/header.php",[
        "fb_url" => $fb_url,
        "vk_url" => $vk_url,
        "user" => User::getInst()->isAuthorized() ? User::getInst()->getUserInfo()["name"] : false
    ]);
    $sidebar = $app ? "" : render(__DIR__."/../views/sidebar.php",[
        "fb_url" => $fb_url,
        "vk_url" => $vk_url,
        "user" => User::getInst()->isAuthorized() ? User::getInst()->getUserInfo()["name"] : false
    ]);
    $footer = $app ? "<p> </p>" : render(__DIR__."/../views/footer.php",[]);

    $user_info = User::getInst()->getUserInfo();

    list($year,$month,$day) = explode("-",$user_info["birthday"]);
    list($year_t,$month_t,$day_t) = explode("-",date('Y-m-d'));
    $old = $year_t - $year - 1;
    if (mktime(0,0,0,$month_t,$day_t,$year_t) >= mktime(0,0,0,$month,$day,$year_t)) $old++;

    $old_str = "лет";
    if (floor($old/10)%10 != 1) {
        switch ($old%10) {

            case 1:
                $old_str = "год";
                break;

            case 2:
            case 3:
            case 4:
                $old_str = "года";
        }
    }
?><!DOCTYPE html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<head>
	<title>FitEat Cabinet</title>
	<link rel="StyleSheet" type="text/css" href="../stylesheets/main.css"/>
	<link rel="StyleSheet" type="text/css" href="../stylesheets/datepicker.css"/>
	<script type="text/JavaScript" src="../javascript/jquery-2.1.0.js"></script>
	<script type="text/JavaScript" src="../javascript/jquery-ui.min.js"></script>
	<script type="text/javascript" src="../javascript/datepicker.js"></script>
	<script type="text/javascript" src="../javascript/jquery.mask.js"></script>
	<!--<script type="text/javascript" src="javascript/modernizr-custom.min.js"></script>-->
	<script type="text/JavaScript" src="../javascript/jscript.js"></script>
</head>

<body onload="init()">

    <?=$header?>

	<div id="new_product_dialog" class="drop_down_block dialog">
		<div class="drop_down_block_title">Мои продукты</div>

		<div class="clearfix"></div>
		<div class="drop_down_block_content">

			<div class="save_changes_container"><a id="save_changes_button_settings_2" class="save_changes_button" style="">Сохранить изменения</a></div>

			<div class="drop_down_block_options">
				<a class="add_record_to_diary"><span class="drop_down_block_options_plus">+</span> Добавить новый продукт в базу</a>
			</div>

			<div id="settings_products_items_container">

			</div>

		</div>
		<div id="product_dialog_close" class="dialog_close"></div>
	</div>

	<div id="question_dialog" class="dialog">
		<p>Продукт '<span id="question_dialog_name"></span>' отсутствует в базе. Желаете добавить продукт самостоятельно? <span id="question_dialog_span"><a id='open_new_product_dialog'> ДA </a> / <a class="question_dialog_close"> НЕТ </a></span> </p>
		<div class="clearfix"></div>
		<div class="dialog_close question_dialog_close"></div>
	</div>

	<div class="page_container">

		<div class="settings_body">

			<h1>Персональные данные <a id="edit_personal_info" href="settings.php<?php if ($app) echo '?app=on';?>"></a></h1>

			<div class="settings_fields">

				<div class="settings_fields_showroom">
					<p id="showroom_name"><span id="male"><?=$user_info["name"]." ".$user_info["soname"]?></span></p>
					<p id="showroom_parameters"><?=$old." ".$old_str?>, <?=$user_info["growth"]?> см, <?=$user_info["weight"]?> кг</p>
					<p id="showroom_goal">цель <span style="color:#b38bde;"><?=$user_info["norm_k"]?></span> ккал/день</p>
				</div>


				<div class="clearfix"></div>
			</div>

			<div class="drop_down_block">
				<div class="drop_down_block_title">Мои блюда</div>
				<div class="clearfix"></div>
				<div class="drop_down_block_content">

				<div class="save_changes_container"><a id="save_changes_button_settings_1" class="save_changes_button" style="">Сохранить изменения</a></div>

					<div class="drop_down_block_options">
						<!--<a class="add_record_to_diary"><span class="drop_down_block_options_plus">+</span> Добавить блюдо из списка в дневник питания</a>-->
						<a class="create_new_recipe"><span class="drop_down_block_options_plus">+</span> Создать новое блюдо</a>
					</div>

					<div id="settings_recipes_items_container">

					</div>

				</div>
				<div class="drop_down_block_point"></div>
			</div>

			<div class="drop_down_block">
				<div class="drop_down_block_title">Любимые продукты</div>

				<div class="clearfix"></div>
				<div class="drop_down_block_content">

				<div class="save_changes_container"><a id="save_changes_button_settings_3" class="save_changes_button" style="">Сохранить изменения</a></div>
				<!--save_changes_button_settings_2-->

				<div class="drop_down_block_options">
					<a class="add_favourite_record"><span class="drop_down_block_options_plus">+</span> Добавить любимый продукт</a>
				</div>

				<div id="settings_favourite_products_container">

				</div>

				</div>
				<div class="drop_down_block_point"></div>
			</div>

			<div class="drop_down_block">
				<div class="drop_down_block_title">Черный список продуктов</div>

				<div class="clearfix"></div>
				<div class="drop_down_block_content">

				<div class="save_changes_container"><a id="save_changes_button_settings_4" class="save_changes_button" style="">Сохранить изменения</a></div>

				<div class="drop_down_block_options">
					<a class="add_blacklist_record"><span class="drop_down_block_options_plus">+</span> Добавить продукт в черный список</a>
				</div>

				<div id="settings_blacklist_products_container">

				</div>

				</div>
				<div class="drop_down_block_point"></div>
			</div>

			<div class="block_close"></div>
		</div>

		<?=$footer?>

		<?=$sidebar?>

	</div>
</body>
</html>
