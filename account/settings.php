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

    $user_info = User::getInst()->getUserInfo();
    list($year,$month,$day) = explode("-",$user_info["birthday"]);

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

			<h1>Персональные данные</h1>

			<div class="settings_fields">
				
				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Имя</div>
					<div class="settings_field_block_right settings_field_block">
						<div class="settings_field_input_name"><input placeholder="Имя" value="<?=$user_info["name"]?>"/></div>
						<div class="settings_field_input_name"><input placeholder="Фамилия" value="<?=$user_info["soname"]?>"/></div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Пол</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input type="radio" name="gender" value="male"<?php if($user_info["sex"] == User::SEX_MALE) echo " checked"; ?>>Мужской</div>
						<div><input type="radio" name="gender" value="female"<?php if($user_info["sex"] == User::SEX_FEMALE) echo " checked"; ?>>Женский</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Дата рождения</div>
					<div class="settings_field_block_right settings_field_block">
						<div>

							<div>
								<select id="day" name="day">
									<!--<option value="10" selected="selected"/>-->
								</select>
								/
								<select id="month" name="month">
									<!--<option value="1" selected="selected">Января</option>-->
									<option value="1">Января</option><option value="2">Февраля</option><option value="3">Марта</option>
									<option value="4">Апреля</option><option value="5">Мая</option><option value="6">Июня</option>
									<option value="7">Июля</option><option value="8">Августа</option><option value="9">Сентября</option>
									<option value="10">Октября</option><option value="11">Ноября</option><option value="12">Декабря</option>
								</select>
								/
								<select id="year" name="year">
									<!--<option value="1990">1990</option>
									<option value="1991">1991</option>
									<option value="1992" selected="selected">1992</option>
									<option value="1993">1993</option>
									<option value="1994">1994</option>
									<option value="1995">1995</option>
									<option value="1996">1996</option>-->
								</select>	
							</div>

						</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Рост</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input id="settings_field_height" type="number" min="30" max="300" step="1" value="165"/>см</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Вес</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input id="settings_field_weight" type="number" min="5" max="500" step="1" value="65"/>кг</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Образ жизни</div>
					<div class="settings_field_block_right settings_field_block">
						<select id="lifestyle" name="lifestyle">
							<option value="1">Минимальные нагрузки (сидячая работа)</option>
							<option value="2">Необременительные тренировки 2-3 раза в неделю</option>
							<option value="3">Тренировки 4-5 раз в неделю (или работа средней тяжести)</option>
							<option value="4">Интенсивные тренировки 4-5 раз в неделю</option>
							<option value="5">Ежедневные тренировки</option>
							<option value="6">Ежедневные интенсивные тренировки или тренировки 2 раза в день</option>
							<option value="7">Тяжелая физическая работа или интенсивные тренировки 2 раза в день</option>
						</select>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Норма ккалорий</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input type="checkbox" class="settings_field_cal_checkbox" checked>Рассчитать</div>
						<div><input id="settings_field_cal" type="number" min="100" max="5000" step="10" value="2200" readonly/>ккал</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Баланс Б/Ж/У</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input type="checkbox" class="settings_field_pro_checkbox" checked>Рассчитать</div>
						<div>
							<input class="settings_fields_pro" id="settings_field_pro" type="number" min="0" max="100" step="1" value="25" readonly/><span style="color:#ffa371;">Б</span>
							<input class="settings_fields_pro" id="settings_field_fat" type="number" min="0" max="100" step="1" value="40" readonly/><span style="color:#eed406;">Ж</span>
							<input class="settings_fields_pro" id="settings_field_car" type="number" min="0" max="100" step="1" value="35" readonly/><span style="color:#62ddb7;">У</span>
						</div>
					</div>
				</div>

				<div class="clearfix"></div>
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

	</div>
</body>
</html>
