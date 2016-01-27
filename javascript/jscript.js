function init(){
	initSlider('mr'); // init mainpage recipes slider
	initSlider('pr'); // init recipes page slider
	initDropDownBlocks(); // itit dropdown blocks
	CreatePieChart();
	CreateLineChart();
	//CreateSmoothLineChart(); // this fuction call is in double_data_picker init method
	datePickerInit();
	initResize();
	loginInit();
	diaryEventsInit();
	getFoodDiaryRecords();
	settingsFormInit();
}

function diaryEventsInit(){

	$('.record_delete').on("mouseup touchend", function (e){
		var container = $(this).closest('.food_list_record_container');
			$(container).remove();
			DropDownBlockResize();
			activateChanges(true, '#save_changes_button_diary_1');
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

	$('.food_list_records').change(function(){
		activateChanges(true, '#save_changes_button_diary_1');
	});

	// Send foodlist if this event was called.

	$('#save_changes_button_diary_1').unbind().click(function(){
		if( $(this).hasClass('active') ){
			sendDiaryList();
			console.log( localStorage.getItem('upload') );
		}
	});

	$(".imageUpload").unbind().change(function(){
		imagePreview(this);
	});
}

function imagePreview(input){

	imageId = $(input).attr('id');

	if(input.files && input.files[0]){

		var reader = new FileReader();

		reader.onload = function (e){
			$(input).parent().removeClass('no_image');
			$(input).parent().css('background-image', 'url(' + e.target.result + ')');
			localStorage.setItem( imageId, e.target.result );
			console.log( e.target.result );
		}

		reader.readAsDataURL(input.files[0]);
	}
}

function sendDiaryList(){

	// sending data

	activateChanges('false', '#save_changes_button_diary_1');
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

function CreateSmoothLineChart(){

	var elementExists = $('.diary_linechart').length;

	if( elementExists ){

		$.getJSON('http://localhost/diaryChart.json', function(data){
			document.cookie = "diaryChartsData"+"="+JSON.stringify(data)+"; path=/";
			drawSmoothLineChart();
		});

	}
}

function getSmoothData(index){

	var color;

	switch(index){
		case 0:
				color="255,163,113";
			break;
		case 1:
				color="238,212,6";
			break;
		case 2:
				color="98,221,183";
			break;
		case 3:
				color="179,139,222";
			break;
		default:

			break;
	}

	var data = {
	    labels : [],
    	datasets : [
        {
            fillColor : "rgba(100,100,100,0)",
            strokeColor : "rgba(100,100,100,0.15)",
            data : [],
            pointColor : "rgba(0,0,0,0)",
            pointStrokeColor : "transparent"
        },
        {
            fillColor : "rgba("+color+", 0.15)",
            strokeColor : "rgba("+color+", 1)",
            data : [],
            pointColor : 'white',
            pointStrokeColor : "rgba("+color+", 1)",
            pointHighlightFill: "rgba("+color+",1)",
            pointHighlightStroke: "rgba("+color+",1)"
        }
    ]
	};

	var diaryChartsData, j, temp;
	diaryChartsData = JSON.parse( getCookie("diaryChartsData") );
	data.labels = JSON.parse( getCookie("diaryChartsTooltips") );

	for (j=0; j<diaryChartsData.list[index].values.length; j++){
		data.datasets[0].data.push(100);
		data.datasets[1].data.push(parseInt(diaryChartsData.list[index].values[j].val));
	}

	/* random data */

	data.datasets[0].data = [];
	data.datasets[1].data = [];

	function getRandomInt(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (j=0; j<data.labels.length; j++){
		data.datasets[0].data.push(100);
		data.datasets[1].data.push(parseInt( getRandomInt(80, 140) ));
	}
	/* ---------- */

	return data;
}

function resetSmoothLineChartCanvas(){

	var containers = document.getElementsByClassName("diary_linechart_chart_container");
	var i;

	for (i = 0; i < containers.length; i++){
		$(containers[i]).children("canvas").remove();
		$(containers[i]).append('<canvas class="diarySmoothChart'+ (i+1) +'"></canvas>');
		canvas = document.querySelector('.diarySmoothChart'+(i+1));
		ctx = canvas.getContext('2d');
		ctx.canvas.width = $(containers[i]).width(); // resize to parent width
		ctx.canvas.height = $(containers[i]).height(); // resize to parent height
	}
};

function drawSmoothLineChart(){

	var diaryChartsData, i,j;
	diaryChartsData = JSON.parse( getCookie("diaryChartsData") );

	var myData1 = getSmoothData(0), myData2 = getSmoothData(1), myData3 = getSmoothData(2), myData4 = getSmoothData(3);

	resetSmoothLineChartCanvas();

	respChart($(".diarySmoothChart1"),myData1);
	respChart($(".diarySmoothChart2"),myData2);
	respChart($(".diarySmoothChart3"),myData3);
	respChart($(".diarySmoothChart4"),myData4);
}

function initDropDownBlocks(){
	$( '.drop_down_block_point' ).click(
		function() {

		var drop_down_block = $(this).parent();

		if ( drop_down_block.height() > "51"){

			//drop_down_block.height('50');

			$(this).removeClass('box_rotate');

			drop_down_block.find('.drop_down_block_title').css('white-space','nowrap');

			//drop_down_block.removeClass('fullsize');

			drop_down_block.animate({
				height: "50"
			}, 400, function() {
				//console.log('animation complete');
			});

		}else{
			
			//drop_down_block.height('auto');

			var curHeight = drop_down_block.height();
			drop_down_block.css('height', 'auto');
			var autoHeight = drop_down_block.height();
			drop_down_block.height(curHeight);

			$(this).addClass('box_rotate');

			drop_down_block.find('.drop_down_block_title').css('white-space','normal');

			//drop_down_block.addClass('fullsize');

			drop_down_block.animate({
				height: autoHeight
			}, 400, function() {
			//console.log('animation complete');
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
	var slideWidth = $('.' + prefix + '_slide').outerWidth(true);
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
		resetSmoothLineChartCanvas();
		CreateSmoothLineChart();
		diaryInputResize();
		clearTimeout(id);
		id = setTimeout(doneResizing, 400); 
	});

	function doneResizing(){
		CreatePieChart();  
		CreateLineChart();
		DropDownBlockResize();
		if($('.drop_down_block_calendar_id')){calendarMerge();}
	}
}

function diaryInputResize(){

	$(".record_name_input").each(function(){
		this.style.width = $(this).parent().outerWidth() - 50 + 'px';
	});
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
	if(wbdd<10) {wbdd='0'+wbdd}
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
				CreateSmoothLineChart();
				createTooltips(dates);
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
				activateChanges(false, '#save_changes_button_diary_1');
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

function createTooltips(input){
	var start = new Date(input[0]), end = new Date(input[1]);
	var mon = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
	var dates = getDates(start, end);

	function getDates(start, end) {
		var retVal = [];
		var current = new Date(start);
		while (current <= end){
			retVal.push(new Date(current));
			current.addDays(1);
		}
		return retVal;
	}

	dates.forEach(function(item,index){
		day = item.getDate();
		monthIndex = item.getMonth();
		//year = item.getFullYear();
		dates[index] = (day+" "+mon[monthIndex]);
	});

	document.cookie = "diaryChartsTooltips"+"="+JSON.stringify(dates)+"; path=/";
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

function getFoodDiaryRecords(){

	localStorage.setItem( 'recordIds' , 0 );

	if($('.food_list_records')){
		$.getJSON('http://localhost/diary.json', function(data){
			$.each(data.list, function (i) {
				printFoodDiaryRecord(data.list[i].id, data.list[i].type, data.list[i].time, data.list[i].name, data.list[i].weight, data.list[i].link, data.list[i].image, data.list[i].pro, data.list[i].fat, data.list[i].car, data.list[i].kcal);
			});
			diaryEventsInit();
		});
	}
}

function addFoodDiaryRecord(){
	var currentdate = new Date(); 
	var currentMinutes;
	if(currentdate.getMinutes()<10){currentMinutes='0'+currentdate.getMinutes()}else{currentMinutes=currentdate.getMinutes()}
	var currenttime = currentdate.getHours() + ":" + currentMinutes;
	var newId = localStorage.getItem('recordIds');
	localStorage.setItem( 'recordIds' , ++newId );
	printFoodDiaryRecord(newId, 'recType', currenttime, '', '250', '', '', '0', '0', '0', '0');
	diaryEventsInit();
	DropDownBlockResize();
	activateChanges(true, '#save_changes_button_diary_1');
}

function activateChanges(input, buttonClassName){
	if(input.toString() == 'true'){
		$(buttonClassName).addClass('active');
	}else{
		$(buttonClassName).removeClass('active');
	}
}

function printFoodDiaryRecord(recId, recType, recTime, recName, recWeight, recLink, recImg, recPro, recFat, recCar, recCal){
	// Функция для создания записи.

	var edit = "", no_image = "";
	if (recType == "fromList"){ edit = " readonly"; }
	if (recImg == ""){no_image = " no_image";}else{ recImg = "background-image:url('" + recImg + "')"; }

	listRecords = $('.food_list_records');

	var scriptRecId = "'"+recId+"'";

	listRecords.prepend('<div class="food_list_record_container">'+
							'<div class="food_list_record">'+
								'<div class="food_list_record_float_width">'+
									'<div class="record_time_box">'+
										'<input class="record_time" maxlength="5" type="time" value="'+recTime+'" onkeypress="">'+
									'</div>'+
									'<div class="record_name"><span class="bullet">• </span><input class="record_name_input" type="text" placeholder="Название блюда" value="'+recName+'"/></div>'+
									'<div class="record_weight">'+
										'<span>Вес</span><span class="record_weight_input"><input type="number" value="'+recWeight+'" step="5"></span>'+
									'</div>'+
									'<div class="record_nutrients">'+
										'<span style="color:#ffa371;">Б</span><span class="record_nutrients_input">'+recPro+'</span>'+
										'<span style="color:#eed406;">Ж</span><span class="record_nutrients_input">'+recFat+'</span>'+
										'<span style="color:#62ddb7;">У</span><span class="record_nutrients_input">'+recCar+'</span>'+
									'</div>'+
									'<div class="record_nutrients">'+
										'<span style="color:#b38bde; padding-bottom:15px;">ккал</span><span class="record_nutrients_input">'+recCal+'</span>'+
									'</div>'+
									'<div class="clearfix"></div>'+
									'<a class="record_recipe_link" href="'+recLink+'">посмотреть рецепт</a>'+
								'</div>'+
								'<div class="food_list_record_static_width">'+
									'<div class="record_image'+no_image+'" style="'+recImg+'" onclick="document.getElementById('+scriptRecId+').click();">'+
										'<input type="file" class="imageUpload" id="'+recId+'" accept="image/*" style="display:none;" />'+
										'<div class="record_delete">✖</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>');
}

function settingsFormInit(){

	var i;

	for(i=1; i<=91; i++){
		$('#year').append($('<option>', {
			value: i,
			text: 1919+i
		}));
	}

	$('#year').val('66');

	updateNumberOfDays();

	$('#year, #month').on("change", function(){
		updateNumberOfDays();
	});

	$('.settings_field_cal_checkbox').click(function(){
		if (this.checked){
			console.log('readonly1');
			$("#settings_field_cal").attr('readonly','readonly');
		}else{
			console.log('smth1');
			$("#settings_field_cal").removeAttr('readonly');
		}
	});

	$('.settings_field_pro_checkbox').click(function(){
		if (this.checked){
			console.log('readonly2');
			$("#settings_field_pro").attr('readonly','readonly');
			$("#settings_field_fat").attr('readonly','readonly');
			$("#settings_field_car").attr('readonly','readonly');
		}else{
			console.log('smth2');
			$("#settings_field_pro").removeAttr('readonly');
			$("#settings_field_fat").removeAttr('readonly');
			$("#settings_field_car").removeAttr('readonly');
		}
	});

	// Send foodlist if this event was called.

	$('#save_changes_button_settings_1').unbind().click(function(){
		if( $(this).hasClass('active') ){
			activateChanges('false', '#save_changes_button_settings_1');
			cleanSettingsPage();
			DropDownBlockResize();
			console.log( 'Send settings 1 form' );
		}
	});

	settingsFormEvents();
	getPersonalRecipeRecords();
}

function updateNumberOfDays(){
	tempDay = $('#day').val();
	$('#day').html('');
	month=$('#month').val();
	year=parseInt($('#year').val()) + 1919;
	days=daysInMonth(month, year);

	for(i=1; i < days+1 ; i++){
		$('#day').append($('<option />').val(i).html(i));
	}

	$('#day').val(tempDay);
	if ( $('#day').val() == null ){
		$('#day').val('1');
	}
}

function daysInMonth(month, year) {
	var temp = $('#day').val();
    return new Date(year, month, 0).getDate();
}

function settingsFormEvents(){

	$(".settings_recipes_item_part_delete").unbind().click(function(){
		cleanSettingsPage();
		$(this).closest('.settings_recipes_item_container').find('.settings_recipes_item_part_restore').css('display','table');
		$(this).closest('.settings_recipes_item_box').css('display','none');
		activateChanges(true, '#save_changes_button_settings_1');

		$(".settings_recipes_item_part_restore").unbind().click(function(){
			console.log('restore');
			$(this).css('display','none');
			var container = $(this).closest(".settings_recipes_item_container");
			container.children(".settings_recipes_item_box").css('display','table');
		});
	});

	$('.settings_recipes_item').change(function(){
		activateChanges(true, '#save_changes_button_settings_1');
	});

	$('.create_new_recipe').unbind().click(function(){
		console.log('create new recipe');
		printPersonalRecipeRecord(0,'Новое блюдо',[]);
		activateChanges(true, '#save_changes_button_settings_1');
		DropDownBlockResize();
	});

	$('.recipe_delete').unbind().click(function(){
		cleanSettingsPage();
		$(this).closest('.settings_recipes_items_main_container').find('.settings_recipes_items_container_restore').css('display','table');
		$(this).closest('.settings_recipes_item').css('display','none');
		activateChanges(true, '#save_changes_button_settings_1');
		DropDownBlockResize();

		$(".settings_recipes_items_container_restore").unbind().click(function(){
			console.log('restore big');
			var container = $(this).closest(".settings_recipes_items_main_container");
			container.children(".settings_recipes_item").css('display','block');
			$(this).css('display','none');
			DropDownBlockResize();
		});
	});

	$('.recipe_add_new_product').unbind().click(function(){
		console.log('delete this little shit');
		printRecipeRecordItem( $(this).closest('.settings_recipes_items_main_container') , 'Новый ингредиент', 100);
		activateChanges(true, '#save_changes_button_settings_1');
		DropDownBlockResize();
		settingsFormEvents();
	});
}

function cleanSettingsPage(){

	$('.settings_recipes_item').each(function(){
		if ($(this).css('display') == 'none'){
			console.log( $(this).parent().find('input').val() + ' ....... delete');
			$(this).parent().remove();
		}
	});

	$('.settings_recipes_item_box').each(function(){
		if ($(this).css('display') == 'none'){
			console.log( $(this).parent().find('input').val() + ' ....... delete');
			$(this).parent().remove();
		}
	});
}

function getPersonalRecipeRecords(){

	//localStorage.setItem( 'recordIds' , 0 );

	if($('.food_list_records')){
		$.getJSON('http://localhost/userRecipes.json', function(data){
			var products = [];
			$.each(data.recipes, function (i) {

				products = [];

				$.each(data.recipes[i].products, function (j) {
					products.push(data.recipes[i].products[j]);
				});

				printPersonalRecipeRecord(data.recipes[i].recipeID, data.recipes[i].recipeName, products);
			});
		});

		settingsFormEvents();
	}
}

function printPersonalRecipeRecord(recId, recName, products){

	// Функция для создания записи.

	var innerHTHL_Code = '<div class="settings_recipes_items_main_container">'+
							'<div class="settings_recipes_item settings_recipes_item_FH">'+
								'<div class="settings_recipes_item_name" style="margin-bottom: 15px;">'+
									'<input type="text" value="'+recName+'" />'+
								'</div>'+
								'<div class="settings_recipes_items_container">';


	innerHTHL_Code = innerHTHL_Code + 
							'</div>'+

							'<a class="recipe_add_new_product">Добавить ингредиент</a>'+
							'<a class="recipe_delete">Удалить блюдо</a>'+

							'<div class="arrow" onclick="$(this).parent().toggleClass(&#39;settings_recipes_item_AH settings_recipes_item_FH&#39;);DropDownBlockResize();"></div>'+
						'</div>'+
						'<div class="settings_recipes_items_container_restore">'+
							'<div class="settings_recipes_items_container_restore_text ellipsisOnOverflow"><div class="ellipsisOnOverflow">Восстановить ('+recName+')</div></div>'+
							'<div class="settings_recipes_items_container_restore_button"></div>'+
						'</div>';

	var container = $('#settings_recipes_items_container');
	container.append(innerHTHL_Code);

	$.each(products, function (i) {
		printRecipeRecordItem(container, products[i].productName, products[i].weight);
	});

	settingsFormEvents();
}

function printRecipeRecordItem(parentObject, productName, weight){
	$(parentObject).find(".settings_recipes_items_container").last().append('<div class="settings_recipes_item_container">'+
									'<div class="settings_recipes_item_box">'+
										'<div class="settings_recipes_item_part_name_container">'+
											'<div class="settings_recipes_item_part_name">'+
												'<input class="" value="'+productName+'"/>'+
											'</div>'+
										'</div>'+
										'<div class="settings_recipes_item_part_weight"><input type="number" value="'+weight+'" />(г)</div>'+
										'<div class="settings_recipes_item_part_delete"></div>'+
									'</div>'+
									'<div class="settings_recipes_item_part_restore">'+
									'<div class="settings_recipes_item_part_restore_text ellipsisOnOverflow"><div class="ellipsisOnOverflow">Восстановить ('+productName+')</div></div>'+
										'<div class="settings_recipes_item_part_restore_button"></div>'+
									'</div>'+
								'</div>');
}

function respChart(selector, data, options){

	var ctx = selector.get(0).getContext("2d");

	options = {

		responsive: false,
		maintainAspectRatio: false,
	    scaleShowGridLines : false,
	    scaleGridLineColor : "rgba(0,0,0,.05)",
	    scaleGridLineWidth : 1,
	    scaleShowHorizontalLines: true,
	    scaleShowVerticalLines: true,
	    scaleBeginAtZero: false,
	    showScale: false,
	    bezierCurve : true,
	    bezierCurveTension : 0.4,
	    pointDot : true,
	    pointDotRadius : 3,
	    pointDotStrokeWidth : 2,
	    pointHitDetectionRadius : 5,
	    datasetStroke : true,
	    datasetStrokeWidth : 2,
	    datasetFill : true,

	    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=10; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

		customTooltips: function(tooltip){
	        var tooltipEl = $('#chartjs-tooltip');
	        if (!tooltip) {
	            tooltipEl.css({
	                opacity: 0
	            });
	            return;
	        }

	        tooltipEl.removeClass('above below');
	        tooltipEl.addClass(tooltip.yAlign);
	        var color;
	        var innerHtml = '';
	        for (var i = tooltip.labels.length - 1; i >= 1; i--) {

	        	// Add case for colors

	        	color = (tooltip.labels[i]);
	        	if (color < 101){
	        		color = "happy.png";
	        	}else if( color > 109 ){
	        		color = "sad.png";
	        	}else{
	        		color = "normal.png";
	        	}

	        	innerHtml += [
	        		'<div class="chartjs-tooltip-section">',
	        		'	<p class="chartjs-tooltip-value">' + tooltip.title + ' : </p>',
	        		'	<span class="chartjs-tooltip-key" style="background-image: url(images/' + color + ')"></span>', //tooltip.legendColors[i].stroke
	        		'	<span class="chartjs-tooltip-value">' + tooltip.labels[i] + '&nbsp;%</span>',
	        		'</div>'
	        	].join('');
	        }
	        tooltipEl.html(innerHtml);
	        tooltipEl.css({
	            opacity: 1,
	            left: tooltip.chart.canvas.offsetLeft + tooltip.x + 27 + 'px',
	            top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
	            fontFamily: tooltip.fontFamily,
	            fontSize: tooltip.fontSize,
	            fontStyle: tooltip.fontStyle,
	        });
	    }

	};

	var myLineChart = new Chart(ctx).Line(data, options);
}

function getCookie(name){
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function popupSearch(word){
	//если поле поиска не пустое, производим AJAX запрос к файлу search.php
	//и выводим результат в слой search_result
		if ($('#search_field ').val()!='') {
			$.post( "php/popupSearch.php", {word: word}, onSuccess); 
			function onSuccess(data)
			{
				$('#search_result').html(data);
			}
		} 
		//если поле поиска пустое, очищаем слой с результатами поиска
		else {
			$('#search_result').html('');
		}
}

function setFocus(e){

	selectedElement = window.getSelection().focusNode.parentNode;

		if( (window.getSelection().type) == "Range" ){
			// Range was selected
			//console.log('range was selected');
			//elem = document.getElementById('txt1');
			setEndOfContenteditable( selectedElement );
		}else{
			//selectedElement = window.getSelection().focusNode.parentNode;
			
			if ( ( $(selectedElement).hasClass("settings_recipes_item_part_name") )||( $(selectedElement).hasClass("inner") ) ){
				if ( $(selectedElement).hasClass("inner") ) {
					$(selectedElement).removeClass('ellipsisOnOverflow');
				} else{
					$(selectedElement).closest('.inner').removeClass('ellipsisOnOverflow');
				}
			}else{
				$( ".inner" ).addClass('ellipsisOnOverflow');
				//Caret must be moved to the first position
				//setEndOfContenteditable( selectedElement );
			}
		}
}
