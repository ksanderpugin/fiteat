function init(){
	initSlider('mr'); // init mainpage recipes slider
	initDropDownBlocks(); // itit dropdown blocks
	CreatePieChart();
	CreateLineChart();
	datePickerInit();
	initResize();
	loginInit();
	diaryEventsInit();
}

function diaryEventsInit(){

	$('.record_delete').on("mouseup touchend", function (e){
		console.log('delete element');
		var container = $(this).closest('.food_list_record_container');
			$(container).remove();
			DropDownBlockResize();
			/*if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				container.hide();
			}*/

	});

	/*
	if (Modernizr.inputtypes.time) {
		alert('input time доступен');
	} else {
		alert('input time не доступен');
	}
	*/

	// record time

	$('.record_time').mask('Z0:z0', {
		translation: {
			'Z': {
				pattern: /[0-2]/, optional: 0
			},
			'z': {
				pattern: /[0-5]/, optional: 0
			}
		}
	});
}

function loginInit(){
	$("#login_button_container").click(function(){
		username=$("#username").val();
		password=$("#password").val();
		$.ajax({
			type: "POST",
			url: "login/",
			//dateType: "json",
			data:
				{
					mail: username,
					pass: password,
					auth: 'Nikolay'
				},
			success: function(html){    
				if(html=='true'){
					logIn('in');
				}else{
					console.log(html);
				}
			},
			beforeSend:function(){
			}
		});
	return false;
	});
}

function CreatePieChart(){

	var itsParent = document.getElementsByClassName("diary_chart_pie")[0];

	if (itsParent){

	var parentWidth = itsParent.offsetWidth;
	var canvas = document.getElementById("piechart");
	canvas.setAttribute("style","height:"+parentWidth+"px");
	canvas.setAttribute("style","width:"+parentWidth+"px");

	var firstVal = parseInt($(".diary_chart_numbers").children('div').eq(0).html().slice(0,-1)),
	secondVal = parseInt($(".diary_chart_numbers").children('div').eq(1).html().slice(0,-1)),
	thirdVal = parseInt($(".diary_chart_numbers").children('div').eq(2).html().slice(0,-1));

	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height); // clean old chart on resize

	var lastend = -(Math.PI/2);
	var data = [firstVal,secondVal,thirdVal];
	var myTotal = 0;
	var myColor = ['#ffa371','#fff571','#62ddb7'];

	for(var e = 0; e < data.length; e++)
	{
		myTotal += data[e];
	}

	for (var i = 0; i < data.length; i++) {
		ctx.fillStyle = myColor[i];
		ctx.beginPath();
		ctx.moveTo(canvas.width/2,canvas.height/2);
		ctx.arc(canvas.width/2,canvas.height/2,canvas.height/2,lastend,lastend+(Math.PI*2*(data[i]/myTotal)),false);
		ctx.lineTo(canvas.width/2,canvas.height/2);
		ctx.fill();
		lastend += Math.PI*2*(data[i]/myTotal);
	}
	}
}

function CreateLineChart(){

	var linechart = document.getElementById("linechart");

	if (linechart){
		var ctx = linechart.getContext('2d'), fullWidth = linechart.width,
		test = document.getElementById("test"), value, center = 0.6;

		if (linechart){
			for (i = 0; i < 4; i++){

				//ctx.fillRect(x, y, width, height);

				value = $(".diary_chart_column3").children('p').eq(i+1).html().slice(0,-1) / 100;

				ctx.fillStyle = '#10bb93';
				ctx.fillRect(0, i*40, fullWidth*(center)*(value), 20);

				ctx.fillStyle = '#eaf9f4';
				ctx.fillRect(fullWidth*(center)*(value), i*40, fullWidth*(center)-fullWidth*(center)*(value), 20);

				ctx.fillStyle = '#fcf4f2';
				ctx.fillRect(fullWidth*(center), i*40, fullWidth*(1-center), 20);

				if (value > 1){
					ctx.fillStyle = '#ed7470'; // #c82915
					ctx.fillRect(fullWidth*(center), i*40, fullWidth*(1-center)*(value-1) , 20);
					// красим фон $(".diary_chart_column3").children('p').eq(i+1) в красный;
					$(".diary_chart_column3").children('p').eq(i+1).css('color', '#ed7470');
				}else{
					// красим фон $(".diary_chart_column3").children('p').eq(i+1) в зеленый;
					$(".diary_chart_column3").children('p').eq(i+1).css('color', '#10bb93');
				}
			}
		}
	}
}

function initDropDownBlocks(){
	$( '.drop_down_block_point' ).click(
		function() {

		var drop_down_block = $(this).parent();

		if ( drop_down_block.height() > "51"){

			//drop_down_block.height('50');

			$(this).removeClass('box_rotate');

			drop_down_block.find('.drop_down_block_title').css('white-space','nowrap');

			drop_down_block.animate({
				height: "50"
			}, 400, function() {
				console.log('animation complete');
			});

		}else{
			
			//drop_down_block.height('auto');

			var curHeight = drop_down_block.height();
			drop_down_block.css('height', 'auto');
			var autoHeight = drop_down_block.height();
			drop_down_block.height(curHeight);

			$(this).addClass('box_rotate');

			drop_down_block.find('.drop_down_block_title').css('white-space','normal');

			drop_down_block.animate({
				height: autoHeight
			}, 400, function() {
			console.log('animation complete');
			});
		}
	});
}

function DropDownBlockResize(){
	$('.drop_down_block').each(function() {
		if ( $(this).height() > "51"){
			$(this).css('height', 'auto');
			var autoHeight = $(this).height();
			$(this).height(autoHeight);
		}
	});
}

function initSlider(prefix){

	var interval;
	var slideCount = $('.' + prefix + '_slide').length;
	var slideWidth = $('.' + prefix + '_slide').width();
	var slideHeight = $('.' + prefix + '_slide').height();
	var sliderSlidesWidth = slideCount * slideWidth;
	var viewportWidth = $('.' + prefix + '_slider_visor').width(); 
	var windowWidth = $( window ).width();
	

	if (windowWidth > 960) /*((viewportWidth/slideWidth) > 2.75)*/ {
		$('.' + prefix + '_slides_container').css({ width: sliderSlidesWidth, marginLeft: - ((sliderSlidesWidth - viewportWidth)/2 - (((slideCount%2)-1) * slideWidth/2))	});
	} else {
		$('.' + prefix + '_slides_container').css({ width: sliderSlidesWidth });
	}
	$('.' + prefix + '_slider_visor').css({ height: slideHeight }); // width: slideWidth, 
	$('.' + prefix + '_slide:last-child').prependTo('.' + prefix + '_slides_container');

	function moveLeft() {
		$('.' + prefix + '_slides_container').animate({
			left: + slideWidth
		}, 200, function () {
			$('.' + prefix + '_slide:last-child').prependTo('.' + prefix + '_slides_container');
			$('.' + prefix + '_slides_container').css('left', '');
		});
	};

	function moveRight(speed) {
		$('.' + prefix + '_slides_container').animate({
			left: - slideWidth
		}, speed, function () {
			$('.' + prefix + '_slide:first-child').appendTo('.' + prefix + '_slides_container');
			$('.' + prefix + '_slides_container').css('left', '');
		});
	};

	$('.' + prefix + '_control_prev').click(function () {
		moveLeft();
		clearInterval(interval);
	});

	$('.' + prefix + '_control_next').click(function () {
		moveRight(200);
		clearInterval(interval);
	});

	if (windowWidth > 960) /*((viewportWidth/slideWidth) > 2.75)*/ {
	interval = setInterval(function () {
		moveRight(750);
	}, 5000);
	}

	$(window).on('resize', function(){
		var win = $(this); //this = window
		clearInterval(interval);
		if (win.width() >= 961) {
			$('.' + prefix + '_slides_container').css({ width: sliderSlidesWidth, marginLeft: - ((sliderSlidesWidth - viewportWidth)/2 - (((slideCount%2)-1) * slideWidth/2)) });
			interval = setInterval(function () {
			moveRight(750);
			}, 5000);
		} else {
			$('.' + prefix + '_slides_container').css({ width: sliderSlidesWidth, marginLeft: 0 });
		}
	});
}

function sidebarMenu(todo){
	if (todo == 'show'){
		// sidebar_page_background display -> block
		$( ".sidebar_page_background" ).show();
		$( ".sidebar_menu_body" ).show();
	}else{
		$( ".sidebar_page_background" ).hide();
		$( ".sidebar_menu_body" ).hide();
	}
}

function logIn(todo){
	if (todo == 'in'){
		$( ".not_logged_in" ).hide();
		$( ".logged_in" ).show();
	}else{
		$( ".logged_in" ).hide();
		$( ".not_logged_in" ).show();
		$( ".logged_in" ).removeAttr('style');
	}
}

function initResize(){

	var id;

	$(window).resize(function() {
		CreatePieChart();
		CreateLineChart(); 
		clearTimeout(id);
		id = setTimeout(doneResizing, 500);  
	});

	function doneResizing(){
		CreatePieChart();  
		CreateLineChart();
		DropDownBlockResize();
		if($('.drop_down_block_calendar_id')){calendarMerge();}
	}
}

function datePickerInit(){

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	var weekBefore = new Date();
	weekBefore.setDate(weekBefore.getDate() - 7);
	var wbdd = weekBefore.getDate();
	var wbmm = weekBefore.getMonth()+1; //January is 0!
	var wbyyyy = weekBefore.getFullYear();

	if(dd<10) {dd='0'+dd}
	if(mm<10) {mm='0'+mm}
	if(wbdd<10) {wbdd='0'+dd}
	if(wbmm<10) {wbmm='0'+wbmm}

	today = yyyy+'-'+mm+'-'+dd
	weekBefore = wbyyyy+'-'+wbmm+'-'+wbdd

	/* #double_datepicker */

	var double_datepicker = document.getElementById("double_datepicker");
	if (double_datepicker){
		$('#double_datepicker').DatePicker({
			flat: true,
			date: [weekBefore,today],
			current: today,
			calendars: 1,
			mode: 'range',
			starts: 1,
			format: 'Y-m-d-a-e',
			onShow: function(formated, dates){
				var drop_down_block_calendar_date = double_datepicker.closest('.drop_down_block_calendar_date');
				var temp, pos, result;
				var mon = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
				$(drop_down_block_calendar_date).find('.datePart').each(function(i){
					switch (i) {
						case 0:

							temp = formated[0];
							result = temp.slice(11,13);
							$(this).html(result);

							break;
						case 1:

							temp = formated[0];

							pos = 5; //Позиция месяца.
							temp = temp.slice(pos); //09-02-Ср-2
							result = " -";

							result = " "+mon[(temp.slice(0, temp.indexOf('-')))-1] + result;
							// Месяца -
							pos = 9; //
							temp = temp.slice(pos); //Ср-2

							result = ", " + temp + result;
							$(this).html(result);

							break;
						case 2:

							temp = formated[1];
							result = temp.slice(11,13);
							$(this).html(result);

							break;
						case 3:

							temp = formated[1];

							pos = 5; //Позиция месяца.
							temp = temp.slice(pos); //09-02-Ср-2

							result = " "+mon[(temp.slice(0, temp.indexOf('-')))-1];
							// Месяца
							pos = 9; //
							temp = temp.slice(pos); //Ср-2

							result = ", " + temp + result;

							$(this).html(result);

							break;

						default:
					}
				});
				calendarMerge();
			},
			onChange: function(formated, dates){
				var drop_down_block_calendar_date = $(double_datepicker).closest('.drop_down_block_calendar_date');
				var temp, pos, result;
				var mon = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
				$(drop_down_block_calendar_date).find('.datePart').each(function(i){
					switch (i) {
						case 0:

							temp = formated[0];
							result = temp.slice(11,13);
							$(this).html(result);

							break;
						case 1:

							temp = formated[0];

							pos = 5; //Позиция месяца.
							temp = temp.slice(pos); //09-02-Ср-2
							result = " -";

							result = " "+mon[(temp.slice(0, temp.indexOf('-')))-1] + result;
							// Месяца -
							pos = 9; //
							temp = temp.slice(pos); //Ср-2

							result = ", " + temp + result;
							$(this).html(result);

							break;
						case 2:

							temp = formated[1];
							result = temp.slice(11,13);
							$(this).html(result);

							break;
						case 3:

							temp = formated[1];

							pos = 5; //Позиция месяца.
							temp = temp.slice(pos); //09-02-Ср-2

							result = " "+mon[(temp.slice(0, temp.indexOf('-')))-1];
							// Месяца
							pos = 9; //
							temp = temp.slice(pos); //Ср-2

							result = ", " + temp + result;

							$(this).html(result);

							break;

						default:
					}
				});
				calendarMerge();
			}
		});

		$('#double_datepicker').DatePickerFirstPut();

		$( "#double_datepicker" ).css("display", "none");

		$(".choose_period").click(
		function() {
			calendarMerge();
			$( "#double_datepicker" ).css("display", "block");
		});

		$(document).on("mouseup touchend", function (e)
		{
			var container = $("#double_datepicker");

			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				container.hide();
			}
		});
	}

	/* #single_datepicker */

	var single_datepicker = document.getElementById("single_datepicker");
	if (single_datepicker){
		$('#single_datepicker').DatePicker({
			flat: true,
			date: today,
			current: today,
			calendars: 1,
			mode: 'single',
			starts: 1,
			format: 'Y-m-d-a-e',
			onShow: function(formated, dates){
				var drop_down_block_calendar_date = single_datepicker.closest('.drop_down_block_calendar_date');
				var temp, pos, result;
				var mon = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
				$(drop_down_block_calendar_date).find('.datePart').each(function(i){
					switch (i) {
						case 0:

							temp = formated[0];
							result = temp.slice(11,13);
							$(this).html(result);

							break;
						case 1:

							temp = formated[0];

							pos = 5; //Позиция месяца.
							temp = temp.slice(pos); //09-02-Ср-2
							result = " -";

							result = " "+mon[(temp.slice(0, temp.indexOf('-')))-1] + result;
							// Месяца -
							pos = 9; //
							temp = temp.slice(pos); //Ср-2

							result = ", " + temp + result;
							$(this).html(result);

							break;
						case 2:

							temp = formated[1];
							result = temp.slice(11,13);
							$(this).html(result);

							break;
						case 3:

							temp = formated[1];

							pos = 5; //Позиция месяца.
							temp = temp.slice(pos); //09-02-Ср-2

							result = " "+mon[(temp.slice(0, temp.indexOf('-')))-1];
							// Месяца
							pos = 9; //
							temp = temp.slice(pos); //Ср-2

							result = ", " + temp + result;

							$(this).html(result);

							break;

						default:
					}
				});
				calendarMerge();
			},
			onChange: function(formated, dates){
				var drop_down_block_calendar_date = $(single_datepicker).closest('.drop_down_block_calendar_date');
				var temp, pos, result;
				var mon = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
				$(drop_down_block_calendar_date).find('.datePart').each(function(i){
					switch (i) {
						case 0:

							temp = formated;
							result = temp.slice(11,13);
							$(this).html(result);

							break;
						case 1:

							temp = formated;

							pos = 5; //Позиция месяца.
							temp = temp.slice(pos); //09-02-Ср-2

							result = " "+mon[(temp.slice(0, temp.indexOf('-')))-1];
							// Месяца
							pos = 9; //
							temp = temp.slice(pos); //Ср-2

							result = ", " + temp + result;

							$(this).html(result);

							break;

						default:
					}
				});
				calendarMerge();
			}
		});

		$( "#single_datepicker" ).css("display", "none");

		$(".choose_one_day").click(
		function() {
			calendarMerge();
			$( "#single_datepicker" ).css("display", "block");
		});

		$(document).on("mouseup touchend", function (e)
		{
			var container = $("#single_datepicker");

			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				container.hide();
			}
		});

		$('#single_datepicker').DatePickerFirstPut();
	}

	/* -------------------- */
}

function calendarMerge(){
	$('.drop_down_block_calendar').each(function() {
		if ( $(this).find('.drop_down_block_calendar_date').width() > 220){
			$(this).find('.drop_down_block_calendar_id').css({
				'right' : '-25px'
			});

			$(this).find('.datepickerBorderTArrow').css({
				'right': '10px'
			});
		}else{
			var dif = 240 - $(this).find('.drop_down_block_calendar_date').width();
			$(this).find('.drop_down_block_calendar_id').css({
				'right' : - (parseInt(dif)) + 'px'
			});

			$(this).find('.datepickerBorderTArrow').css({
				'right': (parseInt(dif)) - 15 + 'px'
			});
		}
	});
}

/*
function printFoodDiaryRecord(recTime, recName, recType, recWeight, recLink, recPro, recFat, recCar){

}
*/