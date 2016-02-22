<?php

    include_once "../php/basic.php";
    include_once "../php/config.php";
    include_once "../php/sql.php";
    include_once "../php/user.php";

    $user_name = $user_soname = $mail = "";

    $error = false;

    if (!empty($_POST) && strpos($_SERVER['HTTP_REFERER'],$_SERVER['SERVER_NAME']."/account/registration") !== false ) {
        $user_name = strlen($_POST["name"]) < 1 ? "Пользователь" : $_POST["name"];
        $user_soname = $_POST["surname"];
        $mail = $_POST["mail"];
        $pass = $_POST["pass"];
        if (User::getInst()->registration([$mail, $pass, $user_name, $user_soname])) {
            header("Location: http://" . $_SERVER["SERVER_NAME"] . "/account/settings.php");
            exit;
        }
        $error = true;
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
    $footer = $app ? "" : render(__DIR__."/../views/footer.php",[]);

?><!DOCTYPE html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<head>
    <title>FitEat Registration</title>
    <link rel="StyleSheet" type="text/css" href="../stylesheets/main.css"/>
    <link rel="StyleSheet" type="text/css" href="../stylesheets/datepicker.css"/>
    <script type="text/JavaScript" src="../javascript/jquery-2.1.0.js"></script>
    <script type="text/JavaScript" src="../javascript/jquery-ui.min.js"></script>
    <script type="text/javascript" src="../javascript/datepicker.js"></script>
    <script type="text/javascript" src="../javascript/jquery.mask.js"></script>
    <script type="text/javascript" src="../javascript/Chart.js"></script>
    <script type="text/JavaScript" src="../javascript/jscript.js"></script>
    <script>
        $(function(){
            $("form#registration_form").submit(function () {
                var mail = $("input[name=mail]").val();
                if (mail.indexOf('@') != mail.lastIndexOf('@') || mail.indexOf('@') < 1 || mail.indexOf('@') > mail.length-5) {
                    $("input[name=mail]").focus();
                    return false;
                }
                if ($("input[name=pass]").val().length < 6) {
                    alert("Пароли не должен быть короче 6 сивмолов.");
                    $("input[name=pass]").focus();
                    return false;
                }
                if ($("input[name=pass]").val() != $("input[name=conf]").val()) {
                    alert("Пароли не совпадают.");
                    $("input[name=conf]").focus();
                    return false;
                }
            });
            <?php if($error) : ?>
            alert('Пользователь с e-mail "<?=$mail?>" уже зарегистрирован.');
            <?php endif ?>
        });
    </script>
</head>

<body onload="init()">
    <?=$header?>
	<div class="page_container">

		<div class="diary_body" style="min-height:600px;">

			<h1>Регистрация</h1>

			<form id="registration_form" method="post">
			
				<div class="parameter">
					<div class="parameter_name">Имя</div>
					<div class="parameter_value">
						<input type="text" placeholder="Имя" name="name" value="<?=$user_name?>"/>
						<input type="text" placeholder="Фамилия" name="surname" value="<?=$user_soname?>"/>
					</div>
				</div>
				<div class="parameter">
					<div class="parameter_name important_parameter">e-mail</div>
					<div class="parameter_value"><input id="parameter_value_mail" type="text" name="mail" placeholder="example@mail.com" value="<?=$mail?>"/></div>
				</div>
				<div class="parameter">
					<div class="parameter_name important_parameter">Пароль</div>
					<div class="parameter_value"><input type="password" name="pass" /></div>
				</div>
				<div class="parameter">
					<div class="parameter_name important_parameter">Повторите пароль</div>
					<div class="parameter_value"><input type="password" name="conf" /></div>
				</div>
				<div id="send_button_container">
					<input type="submit" id="send_button" name="registrationSubmit" value="Зарегистрироваться" />
				</div>
				<div id="parameter_soc_login" class="parameter">
					<div class="parameter_name">Авторизация через социальные сети</div>
					<div class="parameter_value">
						<a></a>
						<a></a>
					</div>
				</div>

			</form>

		</div>

		<?=$footer?>

		<?=$sidebar?>

	</div>
</body>
</html>