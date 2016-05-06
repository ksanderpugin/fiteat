var diaryFoodListBones = {}, userProductBones = {}, userRecipeBones = {}, userFavouriteProducts = {}, userBlacklistProducts = {},
	foodDiaryRecordIDs = 0, personalProductRecordsIDs = 10000, personalRecipeRecordsIDs = 0, personalProductRecipeRecordsIDs = 0,
	favouriteProductIDs = 0, blacklistProductIDs = 0,
	typingTimer = 0;

function init(){
	initSlider('mr'); // init mainpage recipes slider
	initSlider('pr'); // init recipes page slider
	initDropDownBlocks(); // itit dropdown blocks
	CreatePieChart();
	CreateLineChart();
	datePickerInit();
	initResize();
	loginInit();
	diaryEventsInit();
	getFoodDiaryRecords();
	accountFormsInit();
}

function dropDownBlockResize(){
	$('.drop_down_block').each(function() {
		if ( $(this).height() > "51"){
			$(this).css('height', 'auto');
			var autoHeight = $(this).height();
			$(this).height(autoHeight);
		}
	});
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
			dropDownBlockResize();
			activateChanges(true, '#save_changes_button_diary_1');

	});

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
		typeOfItem = typeMap[eventObject.originalEvent.path[0].className],
		newValueOfItem = eventObject.originalEvent.target.value;

		if (typeOfItem == 'image'){
			imagePreview( eventObject.originalEvent.path[0], currentID, typeOfItem);
		}else{
			diaryInfoChanges(2, currentID, typeOfItem, newValueOfItem);
		}

	});

	// Send foodlist if this event was called.

	$('#save_changes_button_diary_1').unbind().click(function(){
		if( $(this).hasClass('active') ){
			sendDiaryList();
		}
	});
}

function imagePreview(input, viewIndex, changesType){

	var	BASE64;
	var diaryFoodList = diaryFoodListBones;

	imageId = $(input).attr('id');

	if(input.files && input.files[0]){

		var reader = new FileReader();

		reader.onload = function (e){
			$(input).parent().removeClass('no_image');
			$(input).parent().css('background-image', 'url(' + e.target.result + ')');
			localStorage.setItem( imageId, e.target.result );
			BASE64 = String(e.target.result);

			$(diaryFoodList.list).each(function(){
				if(this.id == viewIndex){
					this[ changesType ] = BASE64;
					diaryFoodListBones = diaryFoodList;
					console.log(diaryFoodListBones);
				}
			});
		};

		reader.readAsDataURL(input.files[0]);
	}
}

function sendDiaryList(){

	// sending data

	console.log( diaryFoodListBones );

	/*
	$.ajax({
		type: "POST",
		url: "?",
		dateType: "json",
		data: diaryFoodListBones,
		success: function(newIDs){
				// Set new IS's.
				// Clean local storage diaryFoodListBones from deleted items.
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
	}

	function moveRight(speed) {
		$('.' + prefix + '_slides_container').animate({
			left: - slideWidth
		}, speed, function () {
			$('.' + prefix + '_slide:first-child').appendTo('.' + prefix + '_slides_container');
			$('.' + prefix + '_slides_container').css('left', '');
		});
	}

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
		$( ".sidebar_page_background" ).fadeIn(400);
		$( ".sidebar_menu_body" ).show('slide',{direction:'left'},400);
	}else{
		$( ".sidebar_page_background" ).fadeOut(400);
		$( ".sidebar_menu_body" ).hide('slide',{direction:'left'},400);
	}
}

function logIn(todo){
	if (todo == 'in'){
        var login_input = document.getElementById('username').value,
            password_input = document.getElementById('password').value;
        if (login_input === '') {
            document.getElementById('username').focus();
            return false;
        }
        if (password_input === '') {
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
		answersPosition();
		clearTimeout(id);
		id = setTimeout(doneResizing, 400);
	});

	function doneResizing(){
		CreatePieChart();
		CreateLineChart();
		dropDownBlockResize();
		if($('.drop_down_block_calendar_id').length === 0){calendarMerge();}
	}
}

function answersPosition(){
	if (document.getElementById('active_input_field')){
		var container = $('#active_input_field').closest('.settings_recipes_item_box');
		var l = container.offset().left, t = container.offset().top + 28;
		$('#answers').addClass('aVisible').removeClass('aInvisible');
		container.css({ boxShadow: 'inset 0px 0px 0px 1px rgb(230, 163, 163)' });
		$('#answers').css({
			top: t+'px',
			left: l+'px',
			backgroundColor: container.css('backgroundColor')
		});
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

	if(dd<10){dd='0'+dd;}
	if(mm<10){mm='0'+mm;}
	if(wbdd<10){wbdd='0'+wbdd;}
	if(wbmm<10){wbmm='0'+wbmm;}

	today = yyyy+'-'+mm+'-'+dd;
	weekBefore = wbyyyy+'-'+wbmm+'-'+wbdd;

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

			if (!container.is(e.target) && container.has(e.target).length === 0){
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

			if (!container.is(e.target) && container.has(e.target).length === 0){
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
		foodDiaryRecordIDs = 0;
		$.getJSON('/diary/getdiary.php', function(data){

			diaryFoodListBones = data;

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
			diaryFoodListBones = diaryFoodChanges;
		});
	}
}

function addFoodDiaryRecord(){
	var currentdate = new Date();
	var currentMinutes;
	if(currentdate.getMinutes()<10){currentMinutes='0'+currentdate.getMinutes();}else{currentMinutes=currentdate.getMinutes();}
	var currenttime = currentdate.getHours() + ":" + currentMinutes;
	var newId = ++foodDiaryRecordIDs;

	newId = '-'+newId;

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
	dropDownBlockResize();
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
	if (recImg === ""){no_image = " no_image";}else{ recImg = "background-image:url('" + recImg + "')"; }

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

function cleanSettingsPage(){

	$('.settings_recipes_item').each(function(){
		if ($(this).css('display') == 'none'){
			console.log( 'Удалить рецепт ' + $(this).parent().attr('id') );
			userRecipesChanges(0, $(this).parent().attr('id'));
			$(this).parent().remove();
		}
	});

	// Products in recipes.
	$('.settings_personal_recipes_item_box').each(function(){
		if ($(this).css('display') == 'none'){
			console.log( 'Удалить продукт ' + $(this).find('.settings_recipes_item_part_name input').attr('id') + ' в блюде ' + $(this).closest('.settings_recipes_items_main_container').attr('id') );
			userRecipesChanges(3, $(this).closest('.settings_recipes_items_main_container').attr('id'), '', $(this).find('.settings_recipes_item_part_name input').attr('id'));
			$(this).parent().remove();
		}
	});

	$('.settings_recipes_item_box').each(function(){
		if ($(this).css('display') == 'none'){
			var container = $(this).closest('.settings_recipes_item_container');
			var changesCase, containerType, itemsID;
			changesCase = 0;
			containerType = container.parent().attr('id');
			itemsID = container.find('.settings_recipes_item_part_name input').attr('id');
			specialProductsChanges(changesCase, containerType, '', itemsID);
			container.remove();
		}
	});

	$('.settings_products_item').each(function(){
		if ($(this).css('display') == 'none'){
			console.log( 'Удалить продукт ' + $(this).attr('id') );
			userProductsChanges(0, $(this).attr('id'));
			$(this).parent().remove();
		}
	});
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
			$.ajax({
				url: 'save_settings.php',
				type: 'POST',
				data: {
					json: JSON.stringify( $( '#'+$(this).attr("id")+'_form' ).serializeArray() )
				},
				dataType: 'json',
				success: function(respond) {
					if (respond.state) {
					//Save OK. Update calculate data from respond.calories, respond.proteins, respond.fats and respond.carbohydrates
						if ($("input.settings_field_cal_checkbox").prop("checked")) $("input#settings_field_cal").val(respond.calories);
						if ($("input.settings_field_pro_checkbox").prop("checked")) {
							$("input#settings_field_pro").val(respond.proteins);
							$("input#settings_field_fat").val(respond.fats);
							$("input#settings_field_car").val(respond.carbohydrates);
						}
						console.log('OK');
						activateChanges('false', '#save_changes_button_personal_info');
					}
				},
				error: function() {
					setTimeout(function(){$("#save_changes_button_personal_info").click();},2000);
				}
			});
		}
	});

	$('#save_changes_button_settings_1').unbind().click(function () {
		if( $(this).hasClass('active') ){
			cleanSettingsPage();
			dropDownBlockResize();
			console.log( 'Send form for: ' + $(this).attr('id') );
			// SEND userRecipeBones
			console.log('SEND user recipes: ' + JSON.stringify(userRecipeBones));
			$.ajax({
				url: 'setuserrecipes.php',
				type: 'POST',
				dataType: 'json',
				data: {
					json: JSON.stringify(userRecipeBones)
				},
				success: function(respond) {
					console.log('Recipe respond: ' + JSON.stringify(respond));
				}
			});
			activateChanges('false', '#'+$(this).attr('id') );
		}
	});

	$('#save_changes_button_settings_2').unbind().click(function () {
		if( $(this).hasClass('active') ){
			cleanSettingsPage();
			dropDownBlockResize();
			console.log( 'Send form for: ' + $(this).attr('id') );
			// SEND userProductBones
			console.log('SEND user products: ' + JSON.stringify(userProductBones));
			activateChanges('false', '#'+$(this).attr('id') );
		}
	});

	$('#save_changes_button_settings_3').unbind().click(function () {
		if( $(this).hasClass('active') ){
			cleanSettingsPage();
			dropDownBlockResize();
			console.log( 'Send form for: ' + $(this).attr('id') );
			// SEND userFavouriteProducts
			console.log('SEND favourite: ' + JSON.stringify(userFavouriteProducts));
			$.ajax({
				url: 'setuserproducts.php?list=favorite',
				type: 'POST',
				dataType: 'json',
				data: {
					json: JSON.stringify(userFavouriteProducts)
				},
				success: function(respond) {
					console.log('respond save favourite: ' + JSON.stringify(respond) );
				}
			});
			activateChanges('false', '#'+$(this).attr('id') );
		}
	});

	$('#save_changes_button_settings_4').unbind().click(function () {
		if( $(this).hasClass('active') ){
			cleanSettingsPage();
			dropDownBlockResize();
			console.log( 'Send form for: ' + $(this).attr('id') );
			// SEND userBlacklistProducts
			console.log('SEND blacklist: ' + JSON.stringify(userBlacklistProducts));
			$.ajax({
				url: 'setuserproducts.php?list=black',
				type: 'POST',
				dataType: 'json',
				data: {
					json: JSON.stringify(userBlacklistProducts)
				},
				success: function(respond) {
					console.log('respond save black: ' + JSON.stringify(respond) );
				}
			});
			activateChanges('false', '#'+$(this).attr('id') );
		}
	});

	$('.settings_body').append('<div id="answers" class="aInvisible"></div>');

	$(".settings_body").unbind('mousedown').on('mousedown', '.answer_block', function(e){

		// #settings_recipes_items_container
		// #settings_favourite_products_container
		// #settings_blacklist_products_container

		var itemsID;

		if( $('#active_input_field').closest('#settings_recipes_items_container').length > 0 ){

			$('#active_input_field').find('input').val(e.target.outerText); // input content
			$('#active_input_field').find('input').attr("value", e.target.outerText); // attribute value
			var ProductID = $('#active_input_field').find('input').attr('id'),
			RecipeID = $('#active_input_field').closest('.settings_recipes_items_main_container').attr('id');
			var newName = { type : 'productName', value: e.target.outerText },
			newID = { type : 'productID', value: e.target.id };
			console.log("ITSME: "+RecipeID+" ... "+ProductID+" ... "+JSON.stringify(newName));
			userRecipesChanges(5, RecipeID, ProductID, newName);
			userRecipesChanges(5, RecipeID, ProductID, newID);
			$('#active_input_field').find('input').attr('id', newID.value);
			activateChanges(true, '#save_changes_button_settings_1');
			$('#answers').addClass('aInvisible').removeClass('aVisible');
			$('#active_input_field').each(function(){
				$(this).removeAttr('id');
			});

		}else if( $('#active_input_field').closest('#settings_favourite_products_container').length > 0 ){

			itemsID = $('#active_input_field').find('input').attr('id');
			$('#active_input_field').find('input').val(e.target.outerText); // input content
			$('#active_input_field').find('input').attr("value", e.target.outerText); // attribute value
			newValue = { 'productID': $(e.target).attr('id'), 'productName': e.target.outerText };
			specialProductsChanges(2, 'favourite', newValue, itemsID);
			activateChanges(true, '#save_changes_button_settings_3');
			$('#active_input_field').find('input').attr('id', e.target.id );

		}else if( $('#active_input_field').closest('#settings_blacklist_products_container').length > 0 ){

			itemsID = $('#active_input_field').find('input').attr('id');
			$('#active_input_field').find('input').val(e.target.outerText); // input content
			$('#active_input_field').find('input').attr("value", e.target.outerText); // attribute value
			newValue = { 'productID': $(e.target).attr('id'), 'productName': e.target.outerText };
			specialProductsChanges(2, 'blacklist', newValue, itemsID);
			activateChanges(true, '#save_changes_button_settings_4');
			$('#active_input_field').find('input').attr('id', e.target.id );

		}else{
			console.log('There is no active field.');
		}
	});

	accountFormEvents();
	getPersonalRecipeRecords();
	getSpecialProducts();
	bonesForPersonalProductRecords();
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
	if ( $('#day').val() === null ){
		$('#day').val('1');
	}
}

function daysInMonth(month, year) {
	var temp = $('#day').val();
	return new Date(year, month, 0).getDate();
}

function accountFormEvents(){

	$(".drop_down_block").unbind('click').on('click', '.settings_recipes_item_part_delete', function(){
		cleanSettingsPage();
		var container = $(this).closest('.settings_recipes_item_container');
		container.find('.settings_recipes_item_part_restore').css('display','table');
		$(this).closest('.settings_recipes_item_box').css('display','none');
		var buttonsID = '';

		if (container.hasClass('recipes_item_container')){
			buttonsID = '#save_changes_button_settings_1';
		}else if (container.hasClass('favourite_item_container')){
			buttonsID = '#save_changes_button_settings_3';
		}else if (container.hasClass('blacklist_item_container')){
			buttonsID = '#save_changes_button_settings_4';
		}

		activateChanges(true, buttonsID);

		$(".settings_recipes_item_part_restore").unbind().click(function(){
			console.log('restore');
			$(this).css('display','none');
			var container = $(this).closest(".settings_recipes_item_container");
			container.children(".settings_recipes_item_box").css('display','table');
		});
	});

	$('.settings_recipes_item').unbind().change(function(eventObject){

		var productID = $(eventObject.originalEvent.path).filter('.settings_recipes_item_container').find('.settings_recipes_item_part_name input').attr('id'),
		itemsContainer = $(eventObject.originalEvent.path).filter('.settings_recipes_items_main_container'),
		itemsID = $(itemsContainer).attr('id'),
		current = $(eventObject.originalEvent.path).filter('.settings_product_pro'),
		newValue = eventObject.originalEvent.target.value;

		if(productID){
			var itemsClassName = eventObject.originalEvent.path[1].className;

			var typeMap = {
				'settings_recipes_item_part_name': 'productName',
				'settings_recipes_item_part_weight': 'weight'
			};

			var typeOfItem = typeMap[itemsClassName];

			var newObject = {
					type : typeOfItem,
					value: newValue
				};
			userRecipesChanges(5, itemsID, productID, newObject);
		}else{
			userRecipesChanges(2, itemsID, 'recipeName', newValue);
		}

		activateChanges(true, '#save_changes_button_settings_1');
	});

	$('.settings_products_item').unbind().change(function(eventObject){
		activateChanges(true, '#save_changes_button_settings_2');

		console.log( eventObject.originalEvent );

		var typeMap = {
							'1': 'proteins',
							'2': 'fats',
							'3': 'carbohydrates',
							'4': 'calories',
							'5': 'productName'
						},
		itemsContainer = $(eventObject.originalEvent.path).filter('.settings_products_item'),
		itemsID = $(itemsContainer).attr('id'),
		current = $(eventObject.originalEvent.path).filter('.settings_product_pro');

		var changesType = $(eventObject.originalEvent.path[ $(eventObject.originalEvent.path).index(current) ]).index();

		if (changesType == -1){
			if( $(eventObject.originalEvent.path[0]).hasClass('settings_product_name') ){
				changesType = 5;
			}
		}

		var typeOfItem = typeMap[changesType],
		newValueOfItem = eventObject.originalEvent.target.value;

		console.log('Был изменен '+changesType+' параметр в продукте с ID: " '+itemsID+' "');
		console.log('Новое значение: '+newValueOfItem);

		userProductsChanges(2, itemsID, typeOfItem, newValueOfItem);

	});

	$('#personal_settings_fields').change(function(){
		activateChanges(true, '#save_changes_button_personal_info');
	});

	$('.create_new_recipe').unbind().click(function(){

		var newRecipe = {
			"recipeID": "-" + (++personalRecipeRecordsIDs),
			"recipeName": "Новое блюдо",
			"products": []
		};

		userRecipesChanges(1, '', '', newRecipe);
		printPersonalRecipeRecord(newRecipe.recipeID, newRecipe.recipeName, []);
		activateChanges(true, '#save_changes_button_settings_1');
		dropDownBlockResize();
	});

	$('.add_record_to_diary').unbind().click(function(){
		createNewProduct();
	});

	$('.add_favourite_record').unbind().click(function(){
		var temp = { 'productID': '-'+(++favouriteProductIDs), 'productName': 'Название продукта'};
		specialProductsChanges(1, 'favourite', temp);
		printFavouriteProductItem(temp.productName, temp.productID);
		activateChanges(true, '#save_changes_button_settings_3');
		dropDownBlockResize();
		accountFormEvents();
	});

	$('.add_blacklist_record').unbind().click(function(){
		var temp = { 'productID': '-'+(++blacklistProductIDs), 'productName': 'Название продукта'};
		specialProductsChanges(1, 'blacklist', temp);
		printBlacklistProductItem(temp.productName, temp.productID);
		activateChanges(true, '#save_changes_button_settings_4');
		dropDownBlockResize();
		accountFormEvents();
	});

	$('.settings_recipe_delete').unbind().click(function(){
		cleanSettingsPage();
		$(this).closest('.settings_recipes_items_main_container').find('.settings_recipes_items_container_restore').css('display','table');
		$(this).closest('.settings_recipes_item').css('display','none');
		activateChanges(true, '#save_changes_button_settings_1');
		dropDownBlockResize();

		$(".settings_recipes_items_container_restore").unbind().click(function(){
			console.log('restore big');
			var container = $(this).closest(".settings_recipes_items_main_container");
			container.children(".settings_recipes_item").css('display','block');
			container.children(".settings_products_item").css('display','block');
			$(this).css('display','none');
			dropDownBlockResize();
		});
	});

	$('.settings_product_delete').unbind().click(function(){
		cleanSettingsPage();
		$(this).closest('.settings_recipes_items_main_container').find('.settings_recipes_items_container_restore').css('display','table');
		$(this).closest('.settings_products_item').css('display','none');
		activateChanges(true, '#save_changes_button_settings_2');
		dropDownBlockResize();

		$(".settings_recipes_items_container_restore").unbind().click(function(){
			console.log('restore big');
			var container = $(this).closest(".settings_recipes_items_main_container");
			container.children(".settings_recipes_item").css('display','block');
			container.children(".settings_products_item").css('display','block');
			$(this).css('display','none');
			dropDownBlockResize();
		});
	});

	$('.recipe_add_new_product').unbind().click(function(){

		var container = $(this).closest('.settings_recipes_items_main_container'),
		ProductObj = {
			"productID": '-'+(++personalProductRecipeRecordsIDs),
			"productName": "Новый ингредиент",
			"weight": "100"
		};

		printRecipeRecordItem( container , ProductObj.productName, ProductObj.weight, ProductObj.productID);

		// Add product to recipe (4, RecipeID, , ProductObj)

		var RecipeID = container.attr('id');

		userRecipesChanges(4, RecipeID, '', ProductObj);

		activateChanges(true, '#save_changes_button_settings_1');
		dropDownBlockResize();
		accountFormEvents();
	});

	$('#settings_recipes_items_container, #settings_favourite_products_container, #settings_blacklist_products_container').unbind('focusin').on('focusin', '.settings_recipes_item_part_name input', function(){

		$(this).closest('.settings_recipes_item_part_name').attr('id', 'active_input_field');
		answersPosition();
		answersEvents();
	});

	$('#settings_recipes_items_container, #settings_favourite_products_container, #settings_blacklist_products_container').unbind('focusout').on('focusout', '.settings_recipes_item_part_name input', function(e){

		$('#open_new_product_dialog').unbind('click').click(function(){
			$('#new_product_dialog').css({
				"display":"block",
				"zIndex":"2"
			});
			$('#question_dialog').css({
				"display":"none",
				"zIndex":"-9999"
			});

			var text = $('#question_dialog_name').text();
			createNewProduct(text, e.target);
		});

		var value = {
			"productID": $("#active_input_field").find("input").attr("id"),
			"productName":  $("#active_input_field").find("input").val()
		};

		checkProductInBase(value);

		$("#active_input_field").find("input").attr("value", $("#active_input_field").find("input").val() );

		$('#active_input_field').each(function(){$(this).removeAttr('id');});

		var container = $(this).closest('.settings_recipes_item_box');

		container.css({ boxShadow: 'inset 0px 0px 0px 0px rgba(0,0,0,0)' });

		$('#answers').addClass('aInvisible').removeClass('aVisible');
		$('#answers').html('');
	});

	$('#settings_favourite_products_container').unbind('change').on('change', '.settings_recipes_item_part_name input', function(e){
		activateChanges(true, '#save_changes_button_settings_3');
		console.log('favourite changed');
	});

	$('#settings_blacklist_products_container').unbind('change').on('change', '.settings_recipes_item_part_name input', function(e){
		activateChanges(true, '#save_changes_button_settings_4');
		console.log('blacklist changed');
	});

	$('#product_dialog_close').unbind('click').click(function(){
		$('#new_product_dialog').css({
			"display":"none",
			"zIndex":"-9999"
		});
	});

	$('.question_dialog_close').unbind('click').click(function(){
		$('#question_dialog').css({
			"display":"none",
			"zIndex":"-9999"
		});
	});
}

function checkProductInBase(value){

	var output, temp = false, url = "../php/checkProductInBase.php?word=" + value.productName;

	setTimeout(function(){
		$.get( url, function( data ) {
			if ($(data).html() === "NO RESULTS"){
				openQuestionDialog(value);
			}else{
			  console.log( "Data from url : " + url );
				output = $( data );
				//console.log( output );
				count = output.find('tr').length;
				output.find('tr').each(function (i) {
		      console.log(this);
					if( ($(this).children().eq(0).text() === value.productID)&&($(this).children().eq(1).text() === value.productName) ){
						temp = true;
					}
					if ( (!--count)&&(!temp) ){
						openQuestionDialog(value);
					}
		    });
			}
		});}, 500);


}

function openQuestionDialog(value){

	$('#question_dialog_name').html(value.productName);
	$('#question_dialog').css({
		"display":"block",
		"zIndex":"2"
	});
}

function createNewProduct(productName, target){

	var newName;

	if (productName){
		newName = productName;
	}else{
		newName = "Новый продукт";
	}

	var newProduct = {
			"productID": "-" + (++personalProductRecordsIDs),
			"productName": newName,
			"proteins": "10.0",
			"fats": "20.0",
			"carbohydrates": "60.0",
			"calories": "660"
		};

	$(target).attr("id", newProduct.productID);

	userProductsChanges(1, '', '', newProduct);

	printPersonalProductsRecord(newProduct.productID, newProduct.productName, newProduct.proteins, newProduct.fats, newProduct.carbohydrates, newProduct.calories );

	activateChanges(true, '#save_changes_button_settings_2');
	dropDownBlockResize();
}

function answersEvents(){
	$('#settings_recipes_items_container, #settings_favourite_products_container, #settings_blacklist_products_container').unbind('keypress keydown').on('keypress keydown', '.settings_recipes_item_part_name input', function(){

			if (this.value.length < 3){
				$('#answers').html('');
			}

			if (typingTimer) {
				clearTimeout(typingTimer);
			}
			typingTimer = setTimeout(getHints, 400);
	});
}

function getHints(){

	console.log('word:' + $('#active_input_field').find('input').val() );

	if ( $('#active_input_field').find('input').val().length > 2){

		$.ajax({
			url: '/account/getAnswerList.php',
			type: 'GET',
			data: {
				word: $('#active_input_field').find('input').val()
			},
			dataType: 'json',
			success: function(respond) {
				console.log('Respond: ' + JSON.stringify(respond) );
				var answer = '';
				if(respond.answers.length > 0){
					$.each(respond.answers, function (i) {
						answer +='<p id="'+respond.answers[i].id+'" class="answer_block">'+respond.answers[i].value+'</p>';
					});
					$('#answers').html( answer );
				}else{
					$('#answers').html('');
				}
			},
			error: function() {
				// Печалька
			}
		});
	}
}

function getPersonalRecipeRecords(){

	if($('#settings_recipes_items_container').length){

		$.getJSON('getuserrecipes.php', function(data){

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

				console.log( "ID: "+data.recipes[i].recipeID+"; Название: "+data.recipes[i].recipeName+";");
				console.log( products );

				printPersonalRecipeRecord(data.recipes[i].recipeID, data.recipes[i].recipeName, products);
			});
			//userRecipeBones = objBones;
			userRecipeBones = data;
		}).fail(function( jqxhr, textStatus, error ){
			 var err = textStatus + ', ' + error;
			 console.log( "Request Failed: " + err);
		});


		accountFormEvents();
	}
}

function getSpecialProducts(){


	$.getJSON('/account/getuserproducts.php', function(data){

		var objBones, temp;

		if(document.getElementById('settings_favourite_products_container')){
			objBones = { 'products': [] };
			$.each(data.favorite, function (i) {
				temp = 	{ "productID": data.favorite[i].productID, "productName": data.favorite[i].productName };
				objBones.products.push(temp);
				printFavouriteProductItem(data.favorite[i].productName, data.favorite[i].productID);
			});
			userFavouriteProducts = objBones;
		}

		if(document.getElementById('settings_blacklist_products_container')){
			objBones = { 'products': [] };
			$.each(data.black, function (i) {
				temp = 	{ "productID": data.black[i].productID, "productName": data.black[i].productName };
				objBones.products.push(temp);
				printBlacklistProductItem(data.black[i].productName, data.black[i].productID);
			});
			userBlacklistProducts = objBones;
		}

	});

	accountFormEvents();
}

function bonesForPersonalProductRecords(){
	if($('#settings_products_items_container').length){
		userProductBones = {"products": []};
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

							'<div class="arrow" onclick="$(this).parent().toggleClass(&#39;settings_recipes_item_AH settings_recipes_item_FH&#39;);dropDownBlockResize();"></div>'+
						'</div>'+
						'<div class="settings_recipes_items_container_restore">'+
							'<div class="settings_recipes_items_container_restore_text ellipsisOnOverflow"><div class="ellipsisOnOverflow">Восстановить ('+recName+')</div></div>'+
							'<div class="settings_recipes_items_container_restore_button"></div>'+
						'</div>';

	$('#settings_recipes_items_container').prepend(innerHTHL_Code);
	$(".settings_recipes_items_main_container#"+recId).find(".settings_recipes_item_name").effect("highlight",{color:'#fff571'},400);

	$.each(products, function (i) {
		printRecipeRecordItem($(".settings_recipes_items_main_container#"+recId), products[i].productName, products[i].weight, products[i].productID);
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
	container.prepend(innerHTHL_Code);

	$(".settings_products_item#"+recId).effect("highlight",{color:'#fff571'},400);

	accountFormEvents();
}

function printRecipeRecordItem(parentObject, productName, weight, id){
	$(parentObject).find(".settings_recipes_items_container").last().append('<div class="settings_recipes_item_container recipes_item_container">'+
									'<div class="settings_recipes_item_box settings_personal_recipes_item_box">'+
										'<div class="settings_recipes_item_part_name_container">'+
											'<div class="settings_recipes_item_part_name">'+
												'<input id="'+id+'" class="" value="'+productName+'"/>'+
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

function printFavouriteProductItem(productName, baseID){
	$("#settings_favourite_products_container").append('<div class="settings_recipes_item_container favourite_item_container">'+
									'<div class="settings_recipes_item_box">'+
										'<div class="settings_recipes_item_part_name_container">'+
											'<div class="settings_recipes_item_part_name">'+
												'<input id="'+baseID+'" class="" value="'+productName+'"/>'+
											'</div>'+
										'</div>'+
										'<div class="settings_recipes_item_part_delete"></div>'+
									'</div>'+
									'<div class="settings_recipes_item_part_restore">'+
									'<div class="settings_recipes_item_part_restore_text ellipsisOnOverflow"><div class="ellipsisOnOverflow">Восстановить ('+productName+')</div></div>'+
										'<div class="settings_recipes_item_part_restore_button"></div>'+
									'</div>'+
								'</div>');
}

function printBlacklistProductItem(productName, baseID){
	$("#settings_blacklist_products_container").append('<div class="settings_recipes_item_container blacklist_item_container">'+
									'<div class="settings_recipes_item_box">'+
										'<div class="settings_recipes_item_part_name_container">'+
											'<div class="settings_recipes_item_part_name">'+
												'<input id="'+baseID+'" class="" value="'+productName+'"/>'+
											'</div>'+
										'</div>'+
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
	        		color = "data:image/png;base64,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TUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE1LTExLTI3VDE3OjExOjExPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuMTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4xPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KmXcGTAAAATdJREFUKBWVkb9OwzAQxj/bUVSpokoeAZWpAwMI3oAJGBDMjAzsVd8BHoAXYIV2BEamSvwZkAgStAJWhJQqJagKsY3PiUOEWLBk+e677yzfzwy19XqHsCkaSwK6Q7IEizw5uw0WETsbc0Ec+VtQONDAgtPKc8w4umEn61NuG8isFU5cXhrrhzZN29TE4mcEOvWvTbVdd/wRj7nKVrhMGsvO/PYO9M9U5b1/1EimVdrOzXxceMWAJF8OFfZ6eeVY3/3C4PznAoLhuepHCuxscLN9J+FlWMRTU5trFjKXOYsoZGb841OFhyeN9BN2U0waL1kSZjs0Uv+KcE4S4PBIYnChLL7NNY7evkDQsjhHicpW/42V03MsX8PZdI8o/7Xo4+wfkF6+rrDQnxBmR47mE63ZTTiPibvkGwwhe3jpYX83AAAAAElFTkSuQmCC";
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
		if ($('#search_field ').val()!=='') {
			$.post( "php/popupSearch.php", {word: word}, onSuccess);
		}
		//если поле поиска пустое, очищаем слой с результатами поиска
		else {
			$('#search_result').html('');
		}
}

function onSuccess(data){
	$('#search_result').html(data);
}

function diaryInfoChanges(changesCase, itemsID, changesType, newValue){

	var i, obj;

	switch(changesCase){

		case 0:
				// Delete item;

				if( itemsID.substring(0, 1) == "-"){
					// Delete TEMP object
						for(i = 0; i < diaryFoodListBones.list.length; i++){
							obj = diaryFoodListBones.list[i];
							if((obj.id) == itemsID){
								diaryFoodListBones.list.splice(i, 1);
							}
						}
				}else{
					// Delete object from base
					for(i = 0; i < diaryFoodListBones.list.length; i++){
						obj = diaryFoodListBones.list[i];
						if((obj.id) == itemsID){
								for(var propertyName in diaryFoodListBones.list[i]) {
									if (propertyName != 'id') delete diaryFoodListBones.list[i][propertyName];
								}
								diaryFoodListBones.list[i]['delete'] = "DELETE";
						}
					}
				}

			break;

		case 1:
				// Add item;

				diaryFoodListBones.list.push(newValue);

			break;

		case 2:
				// Information changes;

				console.log(itemsID);
				var itemIndex = findWithAttr(diaryFoodListBones.list, 'id', itemsID);
				diaryFoodListBones.list[ itemIndex ][ changesType ] = newValue;

			break;

		default:
			console.log( 'Something goes wrong.' );
	}

	console.log( JSON.stringify(diaryFoodListBones) );
}

function userRecipesChanges(changesCase, itemsID, changesType, newValue){

	console.log(changesCase+'...'+itemsID+'...'+changesType+'...'+newValue);

	var i, obj, propertyName, recipeIndex;

	switch(changesCase){

		case 0:
				// Delete recipe (0, RecipeID)

				/*if( itemsID.substring(0, 1) == "-"){*/
					// Delete TEMP object
						for(i = 0; i < userRecipeBones.recipes.length; i++){
							obj = userRecipeBones.recipes[i];
							if((obj.recipeID) == itemsID){
								userRecipeBones.recipes.splice(i, 1);
							}
						}
				/*}else{
					// Delete object from base
					for(i = 0; i < userRecipeBones.recipes.length; i++){
						obj = userRecipeBones.recipes[i];
						if((obj.recipeID) == itemsID){
								for(propertyName in userRecipeBones.recipes[i]) {
									if (propertyName != 'recipeID') delete userRecipeBones.recipes[i][propertyName];
								}
								userRecipeBones.recipes[i]['delete'] = "DELETE";
						}
					}
				}*/

			break;

		case 1:
				// Add Recipe (1, , , RecipeObj);

				console.log(newValue);
				userRecipeBones.recipes.push(newValue);

			break;

		case 2:
				// Change Recipe Name (2, RecipeID, 'recipeName', 'New Name');

				var itemIndex = findWithAttr(userRecipeBones.recipes, 'recipeID', itemsID);
				userRecipeBones.recipes[ itemIndex ][ changesType ] = newValue;

			break;

		case 3:
				// Delete product from recipe (3, ProductID, , RecipeID);

				console.log('Удалить продукт '+newValue+' из блюда '+itemsID);

				recipeIndex = findWithAttr(userRecipeBones.recipes, 'recipeID', itemsID);
				var productIndex = findWithAttr(userRecipeBones.recipes[recipeIndex].products, 'productID', newValue);

				console.log(recipeIndex, productIndex);

				/*if( newValue.substring(0, 1) == "-"){*/
					// Delete TEMP product
					userRecipeBones.recipes[recipeIndex].products.splice(productIndex, 1);
				/*}else{
					// Delete product from base
					for(propertyName in userRecipeBones.recipes[recipeIndex].products[productIndex]){
						if (propertyName != 'productID') delete userRecipeBones.recipes[recipeIndex].products[productIndex][propertyName];
					}
					userRecipeBones.recipes[recipeIndex].products[productIndex]['delete'] = "DELETE";
				}*/

			break;

		case 4:
				// Add product to recipe (4, RecipeID, , ProductObj)

				recipeIndex = findWithAttr(userRecipeBones.recipes, 'recipeID', itemsID);

				userRecipeBones.recipes[recipeIndex].products.push(newValue);

			break;

		case 5:
				// Change product in recipe (5, RecipeID, ProductID, { 'productName/weight': 'newName/newWeight'})

				var recipeItemIndex;
				recipeItemIndex = findWithAttr(userRecipeBones.recipes, 'recipeID', itemsID);
				var productItemIndex;
				productItemIndex = findWithAttr(userRecipeBones.recipes[recipeItemIndex].products, 'productID', changesType);

				userRecipeBones.recipes[ recipeItemIndex ].products[productItemIndex][ newValue.type ] = newValue.value;

			break;

		default:
			console.log( 'Something goes wrong.' );
	}

	//console.log(userRecipeBones);
}

function userProductsChanges(changesCase, itemsID, changesType, newValue){

	// userProductBones.products

	var i, obj;

	switch(changesCase){

		case 0:
				// Delete item;

				if( itemsID.substring(0, 1) == "-"){
					// Delete TEMP object
						for(i = 0; i < userProductBones.products.length; i++){
							obj = userProductBones.products[i];
							if((obj.productID) == itemsID){
								userProductBones.products.splice(i, 1);
							}
						}
				}else{
					// Delete object from base
					for(i = 0; i < userProductBones.products.length; i++){
						obj = userProductBones.products[i];
						if((obj.productID) == itemsID){
								for(var propertyName in userProductBones.products[i]) {
									if (propertyName != 'productID') delete userProductBones.products[i][propertyName];
								}
								userProductBones.products[i]['delete'] = "DELETE";
						}
					}
				}

			break;

		case 1:
				// Add item;

				console.log(newValue);
				userProductBones.products.push(newValue);

			break;

		case 2:
				// Information changes;

				var itemIndex = findWithAttr(userProductBones.products, 'productID', itemsID);
				userProductBones.products[ itemIndex ][ changesType ] = newValue;

			break;

		default:
			console.log( 'Something goes wrong.' );
	}

	console.log( userProductBones );
}

function specialProductsChanges(changesCase, containerType, newValue, itemsID){

	var container;

	if (containerType.indexOf('favourite') > -1){
		containerType = 'favourite';
		container = userFavouriteProducts;
	}else if(containerType.indexOf('blacklist') > -1){
		containerType = 'blacklist';
		container = userBlacklistProducts;
	}else{
		console.log('something wrong');
	}

	// changesCase - 1 add, 0 delete, 2 change
	// containerType - favourite, blacklist
	// newValue - new item to replace with
	// itemsID - product ID to change

	switch(changesCase){

		case 0:

				console.log('Delete ...' + itemsID + ' from ' + containerType);

				// Delete item;

				for(var i = 0; i < container.products.length; i++){
					var obj = container.products[i];
					if((obj.productID) == itemsID){
						container.products.splice(i, 1);
					}
				}

			break;

		case 1:
				// Add item;

				container.products.push(newValue);

			break;

		case 2:
				// Information changes;

				var itemIndex = findWithAttr(container.products, 'productID', itemsID);

				console.log('changesCase: '+changesCase);
				console.log('containerType: '+containerType);
				console.log('newValue: '+JSON.stringify(newValue));
				console.log('itemsID: '+itemsID);
				console.log('container.products[ itemIndex ]: '+JSON.stringify(container.products[itemIndex]));

				container.products[ itemIndex ] = newValue;

			break;

		default:
			console.log( 'Something goes wrong.' );
	}
}

function findWithAttr(array, attr, value){
	for(var i = 0; i < array.length; i += 1) {
		if(array[i][attr] == value) {
			return i;
		}
	}
}


function setParent(el, newParent){
	newParent.append(el);
}
