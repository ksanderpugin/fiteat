<?php

include_once 'php/config.php';
include_once 'php/basic.php';
include_once 'php/sql.php';
include_once 'php/recipe.php';
include_once 'php/user.php';

$recipes = new Recipe();
$r_data = $recipes->getList(15);

$r_html = render(__DIR__ . "/views/mr_slide.php",["recipes" => $r_data]);

$fb_url = Config::getFbUrl();
$vk_url = Config::getVkUrl();
$header = render(__DIR__."/views/header.php",[
    "fb_url" => $fb_url,
    "vk_url" => $vk_url,
    "user" => User::getInst()->isAuthorized() ? User::getInst()->getUserInfo()["name"] : false
]);
$sidebar = render(__DIR__."/views/sidebar.php",[
    "fb_url" => $fb_url,
    "vk_url" => $vk_url,
    "user" => User::getInst()->isAuthorized() ? User::getInst()->getUserInfo()["name"] : false
]);

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<head>
    <title>FitEat</title>
    <link rel="StyleSheet" type="text/css" href="stylesheets/main.css"/>
    <link rel="StyleSheet" type="text/css" href="stylesheets/datepicker.css"/>
    <script type="text/JavaScript" src="javascript/jquery-2.1.0.js"></script>
    <script type="text/JavaScript" src="javascript/jquery-ui.js"></script>
    <script type="text/javascript" src="javascript/datepicker.js"></script>
    <script type="text/javascript" src="javascript/jquery.mask.js"></script>
    <script type="text/JavaScript" src="javascript/jscript.js"></script>
</head>

<body onload="init()">
    <?=$header?>
	<div class="page_container">
		<div class="main_page_image_background"></div>
		<div class="main_page_image">
			<div>Начни питаться правильно прямо сейчас</div>
			<a href="#">
				Как это работает?
			</a>
		</div>
		<div class="main_points">
			<div class="circle_box">
				<div class="circle">
					<div class="circle_icon"></div>
				</div>
				<div class="circle_text">
					<h1>Рецепты</h1>
					<p>Рецепты блюд от шефов, подробное  описание приготовления с изображениями блюда на каждом шаге</p>
				</div>
			</div>
			<div class="circle_box">
				<div class="circle">
					<div class="circle_icon"></div>
				</div>
				<div class="circle_text">
					<h1>Меню</h1>
					<p>Собирайте свое собственное меню из понравившихся блюд и легко расчитывайте необходимое количество продуктов для покупки</p>
				</div>
			</div>
			<div class="circle_box">
				<div class="circle">
					<div class="circle_icon"></div>
				</div>
				<div class="circle_text">
					<h1>Дневник питания</h1>
					<p>Получайте информацию о полезных веществах на протяжении дня. Используйте его с различных устройств  в удобное вам время</p>
				</div>
			</div>
		</div>

		<div class="quote_block">
			<div style="background-color:rgba(0,0,0,0.25);height:100%;width:100%;display:block;"></div>
			<q>Только живая свежая пища может сделать человека способным воспринимать и понимать истину</q>
			<span>Пифагор</span>
		</div>

		<div class="main_recommendations">
			<h2>Персональные рекомендации</h2>
			<div class="main_recommendations_slider">
				<div class="mr_slider_visor">
					<div class="mr_slides_container">

						<?=$r_html?>

					</div>
					<!--<a class="mr_control_prev"></a>
					<a class="mr_control_next"></a>-->
				</div>
				<a class="mr_control_prev"></a>
				<a class="mr_control_next"></a>
			</div>
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

		<div class="modal_window">
		</div>

	</div>
</body>
</html>
