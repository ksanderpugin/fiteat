<?php
    include_once "../php/basic.php";
    include_once "../php/config.php";
    include_once "../php/sql.php";
    include_once "../php/user.php";

    if (!User::getInst()->isAuthorized()) {
//        header("Location: http://" . $_SERVER['SERVER_NAME'] . "/account/login.php");
//        exit;
    }

    $fb_url = Config::getFbUrl();
    $vk_url = Config::getVkUrl();
    $header = render(__DIR__."/../views/header.php",[
        "fb_url" => $fb_url,
        "vk_url" => $vk_url,
        "user" => User::getInst()->isAuthorized() ? User::getInst()->getUserInfo()["name"] : false
    ]);
    $sidebar = render(__DIR__."/../views/sidebar.php",[
        "fb_url" => $fb_url,
        "vk_url" => $vk_url,
        "user" => User::getInst()->isAuthorized() ? User::getInst()->getUserInfo()["name"] : false
    ]);

?><!DOCTYPE html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<head>
	<title>FitEat Settings</title>
	<link rel="StyleSheet" type="text/css" href="../stylesheets/main.css"/>
	<link rel="StyleSheet" type="text/css" href="../stylesheets/datepicker.css"/>
	<script type="text/JavaScript" src="../javascript/jquery-2.1.0.js"></script>
	<script type="text/JavaScript" src="../javascript/jquery-ui.js"></script>
	<script type="text/javascript" src="../javascript/datepicker.js"></script>
	<script type="text/javascript" src="../javascript/jquery.mask.js"></script>
	<!--<script type="text/javascript" src="javascript/modernizr-custom.min.js"></script>-->
	<script type="text/JavaScript" src="../javascript/jscript.js"></script>
</head>

<body onload="init()">

    <?=$header?>

	<div class="page_container">

		<div class="diary_body">

			<h1>Персональные данные <a id='edit_personal_info'></a></h1>

			<div class="settings_fields">
				
				<div class="settings_fields_showroom">
					<p id="showroom_name"><span id="male">Василий Пупкин</span></p>
					<p id="showroom_parameters">27 лет, 176 см, 72 кг</p>
					<p id="showroom_goal">цель <span style="color:#b38bde;">2200</span> ккал/день</p>
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
				<div class="drop_down_block_point"></div>
			</div>

			<div class="block_close"></div>
		</div>

		<div class="footer">
			<div class="footer_part">
				<h2>Специальные рецепты</h2>
				<div class="footer_recipes_columns_container">
					<div class="footer_recipes_columns">
						<a href="#">Рецепты из лука</a>
						<a href="#">Простые рецепты</a>
						<a href="#">50 рецептов для мивины</a>
						<a href="#">Есть стакан и топор, что делать?</a>
						<a href="#">Холостяцкая яичница</a>
						<a href="#">Микроменю</a>
						<a href="#">Макроменю</a>
						<a href="#">Рыбка-фиш</a>
						<a href="#">Сто рецептов красоты</a>
						<a href="#">Рецепты из лука</a>
						<a href="#">Простые рецепты</a>
						<a href="#">Быстро приготовить</a>
						<a href="#">50 рецептов для мивины</a>
						<a href="#">Холостяцкая яичница</a>
						<a href="#">Микроменю</a>
						<a href="#">Макроменю</a>
						<a href="#">Рыбка-фиш</a>
						<a href="#">Сто рецептов красоты</a>
						<a href="#">Рецепты из лука</a>
						<a href="#">Простые рецепты</a>
						<a href="#">Быстро приготовить</a>
						<a href="#">50 рецептов для мивины</a>
						<a href="#">Есть стакан и топор, что делать?</a>
						<a href="#">Холостяцкая яичница</a>
						<a href="#">Микроменю</a>
						<a href="#">Макроменю</a>
						<a href="#">Рыбка-фиш</a>
						<a href="#">Сто рецептов красоты</a>
					</div>
				</div>
			</div>
			<div class="footer_part">
				<div class="footer_form_container">
					<p>Мы открыты к сотрудничеству :</p>
					<form>
						<p>Ваше имя</p>
						<span id="name_span"><input type="text" placeholder="" name="name"></span>
						<p>Предпочитаемый способ связи</p>
						<span id="contacts_span"><input type="text" placeholder="Ваш имейл или телефон" name="contacts"></span>
						<p>Сообщение</p>
						<span id="message_span"><input type="text" placeholder="" name="message"></span>
						<input type="submit" class="footerSendButton" name="mysubmit" value="Отправить" />
					</form>
				</div>
			</div>
			<div class="clearfix"></div>
		<div class="footer_footer">2015 ©FITEAT Все права защищены</div>
		</div>

		<?=$sidebar?>

	</div>
</body>
</html>
