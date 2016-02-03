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
    $month_arr = ["","Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"];

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

			<div class="settings_fields" id="personal_settings_fields">

			<form id="save_changes_button_personal_info_form">
				
				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Имя</div>
					<div class="settings_field_block_right settings_field_block">
						<div class="settings_field_input_name"><input name="name" placeholder="Имя" enctype="multipart/form-data" value="<?=$user_info["name"]?>"/></div>
						<div class="settings_field_input_name"><input name="surname" placeholder="Фамилия" value="<?=$user_info["soname"]?>"/></div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Пол</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input type="radio" name="gender" value="<?=User::SEX_MALE?>"<?php if($user_info["sex"] == User::SEX_MALE) echo " checked"; ?>>Мужской</div>
						<div><input type="radio" name="gender" value="<?=User::SEX_FEMALE?>"<?php if($user_info["sex"] == User::SEX_FEMALE) echo " checked"; ?>>Женский</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Дата рождения</div>
					<div class="settings_field_block_right settings_field_block">
						<div>

							<div>
								<select id="day" name="day">
									<option value="<?=(int)$day?>" selected="selected"></option>
								</select>
								/
								<select id="month" name="month">
                                    <?php for ($i=1; $i <= 12; $i++) : ?>
                                    <option value="<?=$i?>"<?php if ($i == $month) echo " selected=\"selected\"";?>><?=$month_arr[$i]?></option>
                                    <?php endfor ?>
								</select>
								/
								<select id="year" name="year">
                                    <?php
                                    $year_max = date('Y') - 5;
                                    for ($i = 1920; $i <= $year_max; $i++) : ?>
                                    <option value="<?=$i?>"<?php if ($i == $year) echo " selected=\"selected\"";?>><?=$i?></option>
                                    <?php endfor ?>
								</select>
							</div>

						</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Рост</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input name="height" id="settings_field_height" type="number" min="30" max="300" step="1" value="<?=$user_info["growth"]?>"/>см</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Вес</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input name="weight" id="settings_field_weight" type="number" min="5" max="500" step="1" value="<?=$user_info["weight"]?>"/>кг</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Образ жизни</div>
					<div class="settings_field_block_right settings_field_block">
						<select id="lifestyle" name="lifestyle">
                            <?php for ($i = User::LIFESTYLE_MINIMUM; $i <= User::LIFESTYLE_HEAVY_PHYSICAL_WORK; $i++) : ?>
							<option value="<?=$i?>"<?php if($i == $user_info["lifestyle"]) echo ' selected="selected"'; ?>><?=User::getLifestyleString($i)?></option>
							<?php endfor ?>
						</select>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Норма ккалорий</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input name="calculate_calories" type="checkbox" class="settings_field_cal_checkbox"<?php if($user_info["norm_auto"] >= 10) echo " checked"; ?>>Рассчитать</div>
						<div><input name="calories" id="settings_field_cal" type="number" min="100" max="5000" step="10" value="<?=$user_info["norm_k"]?>"<?php if($user_info["norm_auto"] >= 10) echo " readonly"; ?>/>ккал</div>
					</div>
				</div>

				<div class="settings_field">
					<div class="settings_field_block_left settings_field_block">Баланс Б/Ж/У</div>
					<div class="settings_field_block_right settings_field_block">
						<div><input name="calculate_balance" type="checkbox" class="settings_field_pro_checkbox"<?php if($user_info["norm_auto"] % 2 == 1) echo " checked"; ?>>Рассчитать</div>
						<div>
							<div class="settings_fields_pro_block"><input class="settings_fields_pro" id="settings_field_pro" name="proteins" type="number" min="0" max="100" step="1" value="<?=$user_info["norm_b"]?>"<?php if($user_info["norm_auto"] % 2 == 1) echo " readonly"; ?>/><span style="color:#ffa371;">Б</span></div>
							<div class="settings_fields_pro_block"><input class="settings_fields_pro" id="settings_field_fat" name="fats" type="number" min="0" max="100" step="1" value="<?=$user_info["norm_z"]?>"<?php if($user_info["norm_auto"] % 2 == 1) echo " readonly"; ?>/><span style="color:#eed406;">Ж</span></div>
							<div class="settings_fields_pro_block"><input class="settings_fields_pro" id="settings_field_car" name="carbohydrates" type="number" min="0" max="100" step="1" value="<?=$user_info["norm_u"]?>"<?php if($user_info["norm_auto"] % 2 == 1) echo " readonly"; ?>/><span style="color:#62ddb7;">У</span></div>
						</div>
					</div>
				</div>

				<a id="save_changes_button_personal_info" class="save_changes_button" style="">Сохранить изменения</a>

			</form>

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
