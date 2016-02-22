<?php

include_once "../php/basic.php";
include_once "../php/config.php";
include_once "../php/sql.php";
include_once "../php/user.php";

if (!User::getInst()->isAuthorized()) {
    header("Location: http://" . $_SERVER['SERVER_NAME'] . "/account/login.php");
    exit;
}

$app = array_key_exists("app",$_GET);

$fb_url = Config::getFbUrl();
$vk_url = Config::getVkUrl();
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

?><!DOCTYPE html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<head>
    <title>FitEat Diary</title>
    <link rel="StyleSheet" type="text/css" href="../stylesheets/main.css"/>
    <link rel="StyleSheet" type="text/css" href="../stylesheets/datepicker.css"/>
    <script type="text/JavaScript" src="../javascript/jquery-2.1.0.js"></script>
    <script type="text/JavaScript" src="../javascript/jquery-ui.min.js"></script>
    <script type="text/javascript" src="../javascript/datepicker.js"></script>
    <script type="text/javascript" src="../javascript/jquery.mask.js"></script>
    <script type="text/javascript" src="../javascript/Chart.js"></script>
    <!--<script type="text/javascript" src="../javascript/modernizr-custom.min.js"></script>-->
    <script type="text/JavaScript" src="../javascript/jscript.js"></script>
</head>

<body onload="init()">
	<?=$header?>

	<div class="page_container">

		<div class="diary_body">

			<h1>Дневник питания</h1>

			<div class="diary_chart_block">
				<div class="diary_chart_left_part">

					<div class="diary_chart_pie">
						<canvas id="piechart"></canvas>
					</div>

					<div class="diary_chart_info">
						<div class="diary_chart_labels">
							<div class="diary_chart_label">
								<!--<div class="diary_chart_colored_box" style="background-color: #ffa371;"></div>-->
								<span>Белки</span>
							</div>
							<div class="diary_chart_label">
								<!--<div class="diary_chart_colored_box" style="background-color: #fff571;"></div>-->
								<span>Жиры</span>
							</div>
							<div class="diary_chart_label">
								<!--<div class="diary_chart_colored_box" style="background-color: #62ddb7;"></div>-->
								<span>Углеводы</span>
							</div>
							<div class="clearfix"></div>
						</div>

						<div class="diary_chart_numbers">
							<div class="diary_chart_number" style="color: #ffa371;">18%</div>
							<div class="diary_chart_number" style="color: #eed406;">40%</div>
							<div class="diary_chart_number" style="color: #62ddb7;">42%</div>
							<div class="clearfix"></div>
						</div>
					</div>

					<div class="clearfix"></div>

				</div>

				<div class="diary_chart_right_part">
					<h2>Статистика за сегодня</h2>
					<div class="diary_chart_column diary_chart_column1">
						<p>Б</p>
						<p>Ж</p>
						<p>У</p>
						<p>ккал</p>
					</div>
					<div class="diary_chart_line">
						<canvas id="linechart"></canvas>
					</div>
					<div class="diary_chart_column diary_chart_column2">
						<p>Всего</p>
						<p>26.16</p>
						<p>59.21</p>
						<p>63.33</p>
						<p>870.88</p>
					</div>
					<div class="diary_chart_column diary_chart_column3">
						<p>От нормы на день*</p>
						<p>18%</p>
						<p>169%</p>
						<p>31%</p>
						<p>69%</p>
					</div>
					<div class="clearfix"></div>
				</div>
				<div class="clearfix"></div>
			</div>

			<div class="drop_down_block">
				<div class="drop_down_block_title">Список еды за день</div>
				<div class="drop_down_block_calendar choose_one_day">
					<div class="drop_down_block_calendar_date">
						<div style="display:inline-block;">
							<div style="display:inline-block;">
								<span class="datePart" style="color: #c82915;">Сб</span>
								<span class="datePart">, 15 Августа</span>
							</div>
							<div class="drop_down_block_calendar_icon_block">
								<p id="single_datepicker" class="drop_down_block_calendar_id"></p>
							</div>
						</div>
					</div>
				</div>
				<div class="clearfix"></div>
				<div class="drop_down_block_content">
					<div class="save_changes_container"><a id="save_changes_button_diary_1" class="save_changes_button" style="">Сохранить изменения</a></div>
					<div class="drop_down_block_add_record">
						<a class="add_new_record" onclick="addFoodDiaryRecord()">Новая запись</a>
						<a class="add_new_record_from_list">Запись из списка покупок</a>
					</div>
					<div class="food_list_records">

						<span id="invisible"></span>
					</div>
				</div>
				<div class="drop_down_block_point"></div>
			</div>

			<div class="drop_down_block">
				<div class="drop_down_block_title">Статистика питания за период</div>
				<div class="drop_down_block_calendar choose_period">
					<div class="drop_down_block_calendar_date">
						<div style="display:inline-block;">
							<span class="datePart" style="color: #c82915;"></span>
							<span class="datePart"></span>
						</div>
						<div style="display:inline-block;">
							<div style="display:inline-block;">
								<span class="datePart" style="color: #c82915;"></span>
								<span class="datePart"></span>
							</div>
							<div class="drop_down_block_calendar_icon_block">
								<p id="double_datepicker" class="drop_down_block_calendar_id"></p>
							</div>
						</div>
					</div>
				</div>
				<div class="clearfix"></div>
				<div class="drop_down_block_content">

					<div class="diary_linechart">
						<div class="diary_linechart_name"><span class="bullet" style="color:#ffa371;">• </span>Белки</div>
						<div class="diary_linechart_chart_container"><canvas class="diarySmoothChart1"></canvas></div>
					</div>

					<div class="diary_linechart">
						<div class="diary_linechart_name"><span class="bullet" style="color:#eed406;">• </span>Жиры</div>
						<div class="diary_linechart_chart_container"><canvas class="diarySmoothChart2"></canvas></div>
					</div>

					<div class="diary_linechart">
						<div class="diary_linechart_name"><span class="bullet" style="color:#62ddb7;">• </span>Углеводы</div>
						<div class="diary_linechart_chart_container"><canvas class="diarySmoothChart3"></canvas></div>
					</div>

					<div class="diary_linechart">
						<div class="diary_linechart_name"><span class="bullet" style="color:#b38bde;">• </span>Килокалории</div>
						<div class="diary_linechart_chart_container"><canvas class="diarySmoothChart4"></canvas></div>
					</div>

					<div id="chartjs-tooltip"></div>

					<div style="height:50px;width:100%;float:left;"></div>

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