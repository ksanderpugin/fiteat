var objBones = {};

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
	accountFormsInit();
}

function diaryEventsInit(){

	$('.record_delete').unbind().on("mouseup touchend", function (e){

			var container = $(this).closest('.food_list_record_container');
			var containerIndex = $(container).index('.food_list_record_container');

			var elementsID = $(container).find('.imageUpload').attr('id');

			console.log(elementsID);

			// containerIndex ? 
			diaryInfoChanges(0, elementsID);

			$(container).remove();
			DropDownBlockResize();
			activateChanges(true, '#save_changes_button_diary_1');

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

	$('.food_list_records').unbind().change(function(eventObject){
		activateChanges(true, '#save_changes_button_diary_1');

		// Add changes to 'diaryInfo'.

		var typeMap = {
							record_time: 'time',
							record_weight_value: 'weight',
							record_name_input: 'name',
							imageUpload: 'image'
						},
		current = $(eventObject.originalEvent.path).filter('.food_list_record_container'),
		currentID = $(current).find('.imageUpload').attr('id'),
		index = $(eventObject.originalEvent.path[ $(eventObject.originalEvent.path).index(current) ]).index(),
		typeOfItem = typeMap[eventObject.originalEvent.path[0].className],
		newValueOfItem = eventObject.originalEvent.target.value;

		if (typeOfItem == 'image'){
			imagePreview( eventObject.originalEvent.path[0], currentID, typeOfItem);
		}else{
			diaryInfoChanges(2, index, typeOfItem, newValueOfItem);
		}

	});

	// Send foodlist if this event was called.

	$('#save_changes_button_diary_1').unbind().click(function(){
		if( $(this).hasClass('active') ){
			sendDiaryList();
		}
	});

	/*$(".imageUpload").unbind().change(function(){
		imagePreview(this);
	});*/
}


function imagePreview(input, viewIndex, changesType){

	var	BASE64;
	var diaryFoodList = localStorage.getItem('diaryFoodList');
	diaryFoodList = jQuery.parseJSON( diaryFoodList );

	console.log(diaryFoodList);

	imageId = $(input).attr('id');

	if(input.files && input.files[0]){

		var reader = new FileReader();

		reader.onload = function (e){
			$(input).parent().removeClass('no_image');
			$(input).parent().css('background-image', 'url(' + e.target.result + ')');
			localStorage.setItem( imageId, e.target.result );
			BASE64 = String(e.target.result);

			$(diaryFoodList.list).each(function(){
				if(this['id'] == viewIndex){
					this[ changesType ] = BASE64;
					localStorage.setItem('diaryFoodList', JSON.stringify(diaryFoodList) );
					console.log( localStorage.getItem('diaryFoodList') );
				}
			});
		}

		reader.readAsDataURL(input.files[0]);
	}
}

function sendDiaryList(){

	// sending data

	var diaryFoodList = localStorage.getItem('diaryFoodList');

	console.log( diaryFoodList );

	/*
	$.ajax({
		type: "POST",
		url: "?",
		dateType: "json",
		data: diaryFoodList,
		success: function(newIDs){    
				// Set new IS's.
				// Clean local storage diaryFoodList from deleted items.
			},
		beforeSend:function(){
			}
		});
	*/

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
		$.getJSON('/diary/getdiarychart.php', function(data){
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
}

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

    $('.drop_down_block_title').click(function () {
        $(this).siblings('.drop_down_block_point').click();
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
        var login_input = document.getElementById('username').value,
            password_input = document.getElementById('password').value;
        if (login_input == '') {
            document.getElementById('username').focus();
            return false;
        }
        if (password_input == '') {
            document.getElementById('password').focus();
            return false;
        }
        document.loginform.submit();
		//$( ".not_logged_in" ).hide();
		//$( ".logged_in" ).show();
	}else{
        document.cookie = "uk=; path=/";
        document.location = document.location;
		//$( ".logged_in" ).hide();
		//$( ".not_logged_in" ).show();
		//$( ".logged_in" ).removeAttr('style');
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
		if($('.drop_down_block_calendar_id').length === 0){calendarMerge();}
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

	if($('.food_list_records').length){
		localStorage.setItem( 'foodDiaryRecordIDs' , 0 );
		$.getJSON('/diary/getdiary.php', function(data){
			localStorage.setItem( 'diaryFoodList', JSON.stringify(data));
			var diaryFoodChanges = {
				"list": [] 
			};
			$.each(data.list, function (i) {
				diaryFoodChanges.list[i] = {
					"id": data.list[i].id
				};
				printFoodDiaryRecord(data.list[i].id, data.list[i].type, data.list[i].time, data.list[i].name, data.list[i].weight, data.list[i].link, data.list[i].image, data.list[i].pro, data.list[i].fat, data.list[i].car, data.list[i].kcal);
			});
			diaryEventsInit();
			localStorage.setItem( 'diaryFoodList' , JSON.stringify(diaryFoodChanges));
		});
	}
}

function addFoodDiaryRecord(){
	var currentdate = new Date(); 
	var currentMinutes;
	if(currentdate.getMinutes()<10){currentMinutes='0'+currentdate.getMinutes()}else{currentMinutes=currentdate.getMinutes()}
	var currenttime = currentdate.getHours() + ":" + currentMinutes;
	var newId = localStorage.getItem('foodDiaryRecordIDs');
	localStorage.setItem( 'foodDiaryRecordIDs' , ++newId );

	newId = 'TEMP'+newId;

	var	newValue = {
			"id": newId,
			"time": currenttime,
			"type": "users",
			"name": "",
			"link": "",
			"image": "",
			"weight": "150",
			"pro": "0",
			"fat": "0",
			"car": "0",
			"kcal": "0"
        };

	printFoodDiaryRecord(newId, 'recType', currenttime, '', '150', '', '', '0', '0', '0', '0');

	diaryInfoChanges(1, null, null, newValue);

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
										'<span>Вес</span><span class="record_weight_input"><input class="record_weight_value" type="number" value="'+recWeight+'" step="5"></span>'+
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

function accountFormsInit(){

	updateNumberOfDays();

	$('#year, #month').on("change", function(){
		updateNumberOfDays();
	});

	$('.settings_field_cal_checkbox').click(function(){
		if (this.checked){
			$("#settings_field_cal").attr('readonly','readonly');
		}else{
			$("#settings_field_cal").removeAttr('readonly');
		}
	});

	$('.settings_field_pro_checkbox').click(function(){
		if (this.checked){
			$("#settings_field_pro").attr('readonly','readonly');
			$("#settings_field_fat").attr('readonly','readonly');
			$("#settings_field_car").attr('readonly','readonly');
		}else{
			$("#settings_field_pro").removeAttr('readonly');
			$("#settings_field_fat").removeAttr('readonly');
			$("#settings_field_car").removeAttr('readonly');
		}
	});

	// Send foodlist if this event was called.

	$('#save_changes_button_personal_info').unbind().click(function(){
		if( $(this).hasClass('active') ){
			activateChanges('false', '#'+$(this).attr('id') );
			cleanSettingsPage();
			DropDownBlockResize();
			console.log( 'Send form for: ' + $(this).attr('id') );
			console.log( JSON.stringify( $( '#'+$(this).attr("id")+'_form' ).serializeArray() ) );
			$.ajax({
				url: 'save_settings.php',
				type: 'POST',
				data: {
					json: JSON.stringify( $( '#'+$(this).attr("id")+'_form' ).serializeArray() )
				},
				dataType: 'json',
				success: function(respond) {
					if (respond.state) {
					//    //Save OK. Update calculate data from respond.calories, respond.proteins, respond.fats and respond.carbohydrates
					    if ($("input.settings_field_cal_checkbox").prop("checked")) $("input#settings_field_cal").val(respond.calories);
					    if ($("input.settings_field_pro_checkbox").prop("checked")) {
					        $("input#settings_field_pro").val(respond.proteins);
					        $("input#settings_field_fat").val(respond.fats);
					        $("input#settings_field_car").val(respond.carbohydrates);
					    }
					}
				},
				error: function() {
					setTimeout(function(){$("#save_changes_button_personal_info").click();},2000);
				}
			});
		}
	});

    $('#save_changes_button_settings_1').unbind().click(function () {
        //console.log(JSON.stringify(objBones));
    });

	accountFormEvents();
	getPersonalRecipeRecords();
	getPersonalProductRecords();
}

function updateNumberOfDays(){
	tempDay = $('#day').val();
	$('#day').html('');
	month=$('#month').val();
	year=parseInt($('#year').val());// + 1919;
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

function accountFormEvents(){

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

	$('.settings_products_item').unbind().change(function(eventObject){
		activateChanges(true, '#save_changes_button_settings_2');

		console.log( eventObject.originalEvent );
		
		var typeMap = {
							'1': 'proteins',
							'2': 'fats',
							'3': 'carbohydrates',
							'4': 'calories'
						},
		itemsContainer = $(eventObject.originalEvent.path).filter('.settings_products_item'),
		itemsID = $(itemsContainer).attr('id'),
		current = $(eventObject.originalEvent.path).filter('.settings_product_pro'),
		changesType = $(eventObject.originalEvent.path[ $(eventObject.originalEvent.path).index(current) ]).index(),
		typeOfItem = typeMap[changesType],
		newValueOfItem = eventObject.originalEvent.target.value;

		console.log('Был изменен '+changesType+' параметр в продукте с ID: " '+itemsID+' "');
		console.log('Новое значение: '+newValueOfItem);

		userProductsChanges(2, itemsID, typeOfItem, newValueOfItem);

	});

	$('#personal_settings_fields').change(function(){
		activateChanges(true, '#save_changes_button_personal_info');
	});

	$('.create_new_recipe').unbind().click(function(){
		console.log('create new recipe');
		printPersonalRecipeRecord(0,'Новое блюдо',[]);
		activateChanges(true, '#save_changes_button_settings_1');
		DropDownBlockResize();
	});

	$('.add_record_to_diary').unbind().click(function(){
		console.log('add new record to products list');
		printPersonalProductsRecord(0,'Новый продукт',[]);
		activateChanges(true, '#save_changes_button_settings_2');
		DropDownBlockResize();
	});

	$('.settings_recipe_delete').unbind().click(function(){
		cleanSettingsPage();
		$(this).closest('.settings_recipes_items_main_container').find('.settings_recipes_items_container_restore').css('display','table');
		$(this).closest('.settings_recipes_item').css('display','none');
		activateChanges(true, '#save_changes_button_settings_1');
		DropDownBlockResize();

		$(".settings_recipes_items_container_restore").unbind().click(function(){
			console.log('restore big');
			var container = $(this).closest(".settings_recipes_items_main_container");
			container.children(".settings_recipes_item").css('display','block');
			container.children(".settings_products_item").css('display','block');
			$(this).css('display','none');
			DropDownBlockResize();
		});
	});

	$('.settings_product_delete').unbind().click(function(){
		cleanSettingsPage();
		$(this).closest('.settings_recipes_items_main_container').find('.settings_recipes_items_container_restore').css('display','table');
		$(this).closest('.settings_products_item').css('display','none');
		activateChanges(true, '#save_changes_button_settings_2');
		DropDownBlockResize();

		$(".settings_recipes_items_container_restore").unbind().click(function(){
			console.log('restore big');
			var container = $(this).closest(".settings_recipes_items_main_container");
			container.children(".settings_recipes_item").css('display','block');
			container.children(".settings_products_item").css('display','block');
			$(this).css('display','none');
			DropDownBlockResize();
		});
	});

	$('.recipe_add_new_product').unbind().click(function(){
		console.log('delete this little shit');
		printRecipeRecordItem( $(this).closest('.settings_recipes_items_main_container') , 'Новый ингредиент', 100);
		activateChanges(true, '#save_changes_button_settings_1');
		DropDownBlockResize();
		accountFormEvents();
	});
}

function cleanSettingsPage(){

	$('.settings_recipes_item').each(function(){
		if ($(this).css('display') == 'none'){
			console.log( 'Удалить рецепт ' + $(this).parent().attr('id') );
			$(this).parent().remove();
		}
	});

	$('.settings_recipes_item_box').each(function(){
		if ($(this).css('display') == 'none'){
			console.log( 'Удалить продукт ' + $(this).parent().attr('id') + ' из блюда ' + $(this).closest('.settings_recipes_items_main_container').attr('id') );
			$(this).parent().remove();
		}
	});
}

function getPersonalRecipeRecords(){

	if($('#settings_recipes_items_container').length){

		localStorage.setItem( 'personalRecipeRecordsIDs' , 0 );

		$.getJSON('/diary/getuserrecipes.php', function(data){

			//localStorage.setItem( 'userRecipes', JSON.stringify(data));

			var products = [],
			objBones = { "recipes": [] },
			temp;
			$.each(data.recipes, function (i) {

				products = [];

				temp = 	{ 	
							"recipeID": data.recipes[i].recipeID,
							"products": []
						};

				objBones.recipes.push(temp);

				$.each(data.recipes[i].products, function (j) {
					products.push(data.recipes[i].products[j]);
					temp =	{
								"productID": data.recipes[i].products[j].productID
							};
					objBones.recipes[i].products.push(temp);
				});

				printPersonalRecipeRecord(data.recipes[i].recipeID, data.recipes[i].recipeName, products);
			});
			localStorage.setItem( 'save_changes_button_settings_1_form', JSON.stringify(objBones));
		});
		accountFormEvents();
	}
}

function getPersonalProductRecords(){

	if($('#settings_products_items_container').length){

		localStorage.setItem( 'personalProductRecordsIDs' , 0 );

		$.getJSON('/diary/getuserproducts.php', function(data){

			var products = [],
			objBones = { "products": [] },
			temp;

			$.each(data.products, function (i){

				products = [];

				temp = 	{ "productID": data.products[i].productID };

				objBones.products.push(temp);

				printPersonalProductsRecord( this.productID ,this.productName, this.proteins, this.fats, this.carbohydrates, this.calories);
			});
			localStorage.setItem( 'save_changes_button_settings_2_form', JSON.stringify(objBones));

		});

		DropDownBlockResize();
		accountFormEvents();
	}
}

function printPersonalRecipeRecord(recId, recName, products){

	// Функция для создания записи.

	var innerHTHL_Code = '<div id="'+recId+'" class="settings_recipes_items_main_container">'+
							'<div class="settings_recipes_item settings_recipes_item_FH">'+
								'<div class="settings_recipes_item_name" style="margin-bottom: 15px;">'+
									'<input type="text" value="'+recName+'" />'+
								'</div>'+
								'<div class="settings_recipes_items_container">';


	innerHTHL_Code = innerHTHL_Code + 
							'</div>'+

							'<a class="recipe_add_new_product">Добавить ингредиент</a>'+
							'<a class="recipe_delete settings_recipe_delete">Удалить блюдо</a>'+

							'<div class="arrow" onclick="$(this).parent().toggleClass(&#39;settings_recipes_item_AH settings_recipes_item_FH&#39;);DropDownBlockResize();"></div>'+
						'</div>'+
						'<div class="settings_recipes_items_container_restore">'+
							'<div class="settings_recipes_items_container_restore_text ellipsisOnOverflow"><div class="ellipsisOnOverflow">Восстановить ('+recName+')</div></div>'+
							'<div class="settings_recipes_items_container_restore_button"></div>'+
						'</div>';

	var container = $('#settings_recipes_items_container');
	//container.append(innerHTHL_Code);
    container.prepend(innerHTHL_Code);
    $(".settings_recipes_items_main_container").eq(0).find(".settings_recipes_item_name").effect("highlight",{color:'#55ff55'},400);

	$.each(products, function (i) {
		printRecipeRecordItem(container, products[i].productName, products[i].weight, products[i].productID);
	});

	accountFormEvents();
}

function printPersonalProductsRecord(recId, recName, proteins, fats, carbohydrates, calories){

	// Функция для создания записи.

	var innerHTHL_Code = 	'<div class="settings_recipes_items_main_container">'+
								'<div id="'+recId+'" class="settings_products_item settings_recipes_item_AH" style="padding-bottom: 0px;">'+
									'<div class="settings_recipes_item_name settings_product_item">'+
										'<input class="settings_product_name" type="text" value="'+recName+'" />'+
										'<div class="settings_product_pro first_product"><input type="number" min="0" max="100" step="0.1" value="'+proteins+'"/><span style="color:#ffa371;">Б</span></div>'+
										'<div class="settings_product_pro"><input type="number" min="0" max="100" step="0.1" value="'+fats+'"/><span style="color:#eed406;">Ж</span></div>'+
										'<div class="settings_product_pro"><input type="number" min="0" max="100" step="0.1" value="'+carbohydrates+'"/><span style="color:#62ddb7;">У</span></div>'+
										'<div class="settings_product_pro last_product"><input type="number" min="0" max="99999" step="1" value="'+calories+'"/><span style="color:#b38bde;">ккал</span></div>'+
										'<a class="settings_product_delete"></a>'+
									'</div>'+
								'</div>'+
								'<div class="settings_recipes_items_container_restore">'+
									'<div class="settings_recipes_items_container_restore_text ellipsisOnOverflow"><div class="ellipsisOnOverflow">Восстановить ('+recName+')</div></div>'+
									'<div class="settings_recipes_items_container_restore_button"></div>'+
								'</div>'+
							'</div>';

	var container = $('#settings_products_items_container');
	container.append(innerHTHL_Code);

	accountFormEvents();
}

function printRecipeRecordItem(parentObject, productName, weight, id){
	$(parentObject).find(".settings_recipes_items_container").last().append('<div id="'+id+'" class="settings_recipes_item_container">'+
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
	        		//happy
	        		color = "data:image/png;base64,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TUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE1LTExLTI3VDE3OjExOjYyPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuMTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4xPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAdZXsQAAATBJREFUKBVjZEAC/FumCTKw/TNiZPyvBRL+/5/xGsMvpnMffbLew5QxwhgCe6cEMvz73wXkq8DEoPRdBibG0g/OOetBfLAGqOK1MD5UITL1H6gpGKSJUWD/fAGGP1/OAGWVkVVgYd/9/5PZlOn/70/GMMX/P3xh+H34Alztzy1HGBh+/4HxlUH+Y2JkZAJ7ECT6984Thu/TQS6DgO+TVjH8PnUNxmUABQYLnAdksJhoMPAta4YLCeyaBGfDGEz///8DG/H/12+YGAYNkwMFMxMj67+zQBV3GJmZGX5uPszw5+Jthv8fPoPxnwu3wWIgOZAaUJygBuuv34w/Nx5i+H3sEtgWVks9BvYAOwYGNlZEsIJlgARJEQfXtL9f4P9vJmNYyIH8x8jKd/aDY+IHmBoA24CD5e+cYX0AAAAASUVORK5CYII=";
	        	}else if( color > 109 ){
	        		//sad
	        		color = "data:image/png;base64,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TUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE1LTExLTI3VDE3OjExOjM5PC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuMTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4xPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K1yECjgAAAUNJREFUKBVlUrFKA0EQfXt7CUmjuUZiZ+uJoLGw8hMEkz+w9S/8CMt01lpbKWhjYRTEC4IgCGoQNfGUxNu7vXVmdTUXB5bdN/NmdufNCozZ8eJ0ILXfEPBCj/waeaRl1lm7fOs7mnCH0/mZJmB2DDDrfD97T0BsrXaf9hnbBCYbmL0JYgFSUouTxPlSrZYkpS5F6wXGf9BLfRV6IyVXHPnqM8XRe/JLvVMasaZHfltd6krDk9Sg81yPMrSfhw5i+yHG7ssflshDP6ew67wVVMHLWXsucEe7M9czJN249+RDYePmFZu3fXSG6XgIBl5km1ZJKWI5D+ME91mO9akKjDA4IFymlCbdSq94VL5aKMhqryzUBDKq5BPLycoDhdWXdJZUZYLPZB6cnQHHXL+WxzNhmUVOX4NK8deolvXZ8sVg4Ap9AS78fll8jmdGAAAAAElFTkSuQmCC";
	        	}else{
	        		//normal
	        		color = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAKQWlDQ1BJQ0MgUHJvZmlsZQAASA2dlndUU9kWh8+9N73QEiIgJfQaegkg0jtIFQRRiUmAUAKGhCZ2RAVGFBEpVmRUwAFHhyJjRRQLg4Ji1wnyEFDGwVFEReXdjGsJ7601896a/cdZ39nnt9fZZ+9917oAUPyCBMJ0WAGANKFYFO7rwVwSE8vE9wIYEAEOWAHA4WZmBEf4RALU/L09mZmoSMaz9u4ugGS72yy/UCZz1v9/kSI3QyQGAApF1TY8fiYX5QKUU7PFGTL/BMr0lSkyhjEyFqEJoqwi48SvbPan5iu7yZiXJuShGlnOGbw0noy7UN6aJeGjjAShXJgl4GejfAdlvVRJmgDl9yjT0/icTAAwFJlfzOcmoWyJMkUUGe6J8gIACJTEObxyDov5OWieAHimZ+SKBIlJYqYR15hp5ejIZvrxs1P5YjErlMNN4Yh4TM/0tAyOMBeAr2+WRQElWW2ZaJHtrRzt7VnW5mj5v9nfHn5T/T3IevtV8Sbsz55BjJ5Z32zsrC+9FgD2JFqbHbO+lVUAtG0GQOXhrE/vIADyBQC03pzzHoZsXpLE4gwnC4vs7GxzAZ9rLivoN/ufgm/Kv4Y595nL7vtWO6YXP4EjSRUzZUXlpqemS0TMzAwOl89k/fcQ/+PAOWnNycMsnJ/AF/GF6FVR6JQJhIlou4U8gViQLmQKhH/V4X8YNicHGX6daxRodV8AfYU5ULhJB8hvPQBDIwMkbj96An3rWxAxCsi+vGitka9zjzJ6/uf6Hwtcim7hTEEiU+b2DI9kciWiLBmj34RswQISkAd0oAo0gS4wAixgDRyAM3AD3iAAhIBIEAOWAy5IAmlABLJBPtgACkEx2AF2g2pwANSBetAEToI2cAZcBFfADXALDIBHQAqGwUswAd6BaQiC8BAVokGqkBakD5lC1hAbWgh5Q0FQOBQDxUOJkBCSQPnQJqgYKoOqoUNQPfQjdBq6CF2D+qAH0CA0Bv0BfYQRmALTYQ3YALaA2bA7HAhHwsvgRHgVnAcXwNvhSrgWPg63whfhG/AALIVfwpMIQMgIA9FGWAgb8URCkFgkAREha5EipAKpRZqQDqQbuY1IkXHkAwaHoWGYGBbGGeOHWYzhYlZh1mJKMNWYY5hWTBfmNmYQM4H5gqVi1bGmWCesP3YJNhGbjS3EVmCPYFuwl7ED2GHsOxwOx8AZ4hxwfrgYXDJuNa4Etw/XjLuA68MN4SbxeLwq3hTvgg/Bc/BifCG+Cn8cfx7fjx/GvyeQCVoEa4IPIZYgJGwkVBAaCOcI/YQRwjRRgahPdCKGEHnEXGIpsY7YQbxJHCZOkxRJhiQXUiQpmbSBVElqIl0mPSa9IZPJOmRHchhZQF5PriSfIF8lD5I/UJQoJhRPShxFQtlOOUq5QHlAeUOlUg2obtRYqpi6nVpPvUR9Sn0vR5Mzl/OX48mtk6uRa5Xrl3slT5TXl3eXXy6fJ18hf0r+pvy4AlHBQMFTgaOwVqFG4bTCPYVJRZqilWKIYppiiWKD4jXFUSW8koGStxJPqUDpsNIlpSEaQtOledK4tE20Otpl2jAdRzek+9OT6cX0H+i99AllJWVb5SjlHOUa5bPKUgbCMGD4M1IZpYyTjLuMj/M05rnP48/bNq9pXv+8KZX5Km4qfJUilWaVAZWPqkxVb9UU1Z2qbapP1DBqJmphatlq+9Uuq43Pp893ns+dXzT/5PyH6rC6iXq4+mr1w+o96pMamhq+GhkaVRqXNMY1GZpumsma5ZrnNMe0aFoLtQRa5VrntV4wlZnuzFRmJbOLOaGtru2nLdE+pN2rPa1jqLNYZ6NOs84TXZIuWzdBt1y3U3dCT0svWC9fr1HvoT5Rn62fpL9Hv1t/ysDQINpgi0GbwaihiqG/YZ5ho+FjI6qRq9Eqo1qjO8Y4Y7ZxivE+41smsImdSZJJjclNU9jU3lRgus+0zwxr5mgmNKs1u8eisNxZWaxG1qA5wzzIfKN5m/krCz2LWIudFt0WXyztLFMt6ywfWSlZBVhttOqw+sPaxJprXWN9x4Zq42Ozzqbd5rWtqS3fdr/tfTuaXbDdFrtOu8/2DvYi+yb7MQc9h3iHvQ732HR2KLuEfdUR6+jhuM7xjOMHJ3snsdNJp9+dWc4pzg3OowsMF/AX1C0YctFx4bgccpEuZC6MX3hwodRV25XjWuv6zE3Xjed2xG3E3dg92f24+ysPSw+RR4vHlKeT5xrPC16Il69XkVevt5L3Yu9q76c+Oj6JPo0+E752vqt9L/hh/QL9dvrd89fw5/rX+08EOASsCegKpARGBFYHPgsyCRIFdQTDwQHBu4IfL9JfJFzUFgJC/EN2hTwJNQxdFfpzGC4sNKwm7Hm4VXh+eHcELWJFREPEu0iPyNLIR4uNFksWd0bJR8VF1UdNRXtFl0VLl1gsWbPkRoxajCCmPRYfGxV7JHZyqffS3UuH4+ziCuPuLjNclrPs2nK15anLz66QX8FZcSoeGx8d3xD/iRPCqeVMrvRfuXflBNeTu4f7kufGK+eN8V34ZfyRBJeEsoTRRJfEXYljSa5JFUnjAk9BteB1sl/ygeSplJCUoykzqdGpzWmEtPi000IlYYqwK10zPSe9L8M0ozBDuspp1e5VE6JA0ZFMKHNZZruYjv5M9UiMJJslg1kLs2qy3mdHZZ/KUcwR5vTkmuRuyx3J88n7fjVmNXd1Z752/ob8wTXuaw6thdauXNu5Tnddwbrh9b7rj20gbUjZ8MtGy41lG99uit7UUaBRsL5gaLPv5sZCuUJR4b0tzlsObMVsFWzt3WazrWrblyJe0fViy+KK4k8l3JLr31l9V/ndzPaE7b2l9qX7d+B2CHfc3em681iZYlle2dCu4F2t5czyovK3u1fsvlZhW3FgD2mPZI+0MqiyvUqvakfVp+qk6oEaj5rmvep7t+2d2sfb17/fbX/TAY0DxQc+HhQcvH/I91BrrUFtxWHc4azDz+ui6rq/Z39ff0TtSPGRz0eFR6XHwo911TvU1zeoN5Q2wo2SxrHjccdv/eD1Q3sTq+lQM6O5+AQ4ITnx4sf4H++eDDzZeYp9qukn/Z/2ttBailqh1tzWibakNml7THvf6YDTnR3OHS0/m/989Iz2mZqzymdLz5HOFZybOZ93fvJCxoXxi4kXhzpXdD66tOTSna6wrt7LgZevXvG5cqnbvfv8VZerZ645XTt9nX297Yb9jdYeu56WX+x+aem172296XCz/ZbjrY6+BX3n+l37L972un3ljv+dGwOLBvruLr57/17cPel93v3RB6kPXj/Mejj9aP1j7OOiJwpPKp6qP6391fjXZqm99Oyg12DPs4hnj4a4Qy//lfmvT8MFz6nPK0a0RupHrUfPjPmM3Xqx9MXwy4yX0+OFvyn+tveV0auffnf7vWdiycTwa9HrmT9K3qi+OfrW9m3nZOjk03dp76anit6rvj/2gf2h+2P0x5Hp7E/4T5WfjT93fAn88ngmbWbm3/eE8/syOll+AAAACXBIWXMAAAsTAAALEwEAmpwYAAADpmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE1LTExLTI3VDE3OjExOjExPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuMTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4xPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KmXcGTAAAATdJREFUKBWVkb9OwzAQxj/bUVSpokoeAZWpAwMI3oAJGBDMjAzsVd8BHoAXYIV2BEamSvwZkAgStAJWhJQqJagKsY3PiUOEWLBk+e677yzfzwy19XqHsCkaSwK6Q7IEizw5uw0WETsbc0Ec+VtQONDAgtPKc8w4umEn61NuG8isFU5cXhrrhzZN29TE4mcEOvWvTbVdd/wRj7nKVrhMGsvO/PYO9M9U5b1/1EimVdrOzXxceMWAJF8OFfZ6eeVY3/3C4PznAoLhuepHCuxscLN9J+FlWMRTU5trFjKXOYsoZGb841OFhyeN9BN2U0waL1kSZjs0Uv+KcE4S4PBIYnChLL7NNY7evkDQsjhHicpW/42V03MsX8PZdI8o/7Xo4+wfkF6+rrDQnxBmR47mE63ZTTiPibvkGwwhe3jpYX83AAAAAElFTkSuQmCC";
	        	}

	        	innerHtml += [
	        		'<div class="chartjs-tooltip-section">',
	        		'	<p class="chartjs-tooltip-value">' + tooltip.title + ' : </p>',
	        		'	<span class="chartjs-tooltip-key" style="background-image: url(&#39;' + color + '&#39;)"></span>', //tooltip.legendColors[i].stroke
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

function diaryInfoChanges(changesCase, itemsID, changesType, newValue){

var diaryFoodList = localStorage.getItem('diaryFoodList');

//console.log( diaryFoodList );

diaryFoodList = jQuery.parseJSON( diaryFoodList );

//console.log( diaryFoodList );

switch(changesCase){

	case 0:
			// Delete item;

			if( itemsID.substring(0, 4) == "TEMP"){
				// Delete TEMP object
					for(var i = 0; i < diaryFoodList.list.length; i++){
						var obj = diaryFoodList.list[i];
						if((obj.id) == itemsID){
							diaryFoodList.list.splice(i, 1);
						}
					}
			}else{
				// Delete object from base
				for(var i = 0; i < diaryFoodList.list.length; i++){
					var obj = diaryFoodList.list[i];
					if((obj.id) == itemsID){
							for(var propertyName in diaryFoodList.list[i]) {
								if (propertyName != 'id') delete diaryFoodList.list[i][propertyName];
							}
							diaryFoodList.list[i]['delete'] = "DELETE";
					}
				}	
			}

		break;

	case 1:
			// Add item;

			diaryFoodList.list.push(newValue);
		break;

	case 2:
			// Information changes;

			var itemIndex = diaryFoodList.list.length - 1 - itemsID; // !
			//var itemIndex = findWithAttr(diaryFoodList.list, 'id', itemsID);
			diaryFoodList.list[ itemIndex ][ changesType ] = newValue;
		break;

	default:
		console.log( 'Something goes wrong.' );
}

localStorage.setItem( 'diaryFoodList', JSON.stringify(diaryFoodList));

console.log(  jQuery.parseJSON( localStorage['diaryFoodList'] ));

}

function userProductsChanges(changesCase, itemsID, changesType, newValue){

var userProductsList = localStorage.getItem('save_changes_button_settings_2_form');

userProductsList = jQuery.parseJSON( userProductsList );

switch(changesCase){

	case 0:
			// Delete item;

			/*

			if( itemsID.substring(0, 4) == "TEMP"){
				// Delete TEMP object
					for(var i = 0; i < diaryFoodList.list.length; i++){
						var obj = diaryFoodList.list[i];
						if((obj.id) == itemsID){
							diaryFoodList.list.splice(i, 1);
						}
					}
			}else{
				// Delete object from base
				for(var i = 0; i < diaryFoodList.list.length; i++){
					var obj = diaryFoodList.list[i];
					if((obj.id) == itemsID){
							for(var propertyName in diaryFoodList.list[i]) {
								if (propertyName != 'id') delete diaryFoodList.list[i][propertyName];
							}
							diaryFoodList.list[i]['delete'] = "DELETE";
					}
				}	
			}

			*/

		break;

	case 1:
			// Add item;

			userProductsList.products.push(newValue);

		break;

	case 2:
			// Information changes;
			var itemIndex = findWithAttr(userProductsList.products, 'productID', itemsID);
			userProductsList.products[ itemIndex ][ changesType ] = newValue;

		break;

	default:
		console.log( 'Something goes wrong.' );
}

localStorage.setItem( 'save_changes_button_settings_2_form', JSON.stringify(userProductsList));

console.log(  jQuery.parseJSON( localStorage['save_changes_button_settings_2_form'] ));

}

function findWithAttr(array, attr, value) {
	for(var i = 0; i < array.length; i += 1) {
		if(array[i][attr] === value) {
			return i;
		}
	}
}

