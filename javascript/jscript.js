function init(){
	initSlider('mr'); // init mainpage recipes slider
	initDropDownBlocks(); // itit dropdown blocks
	CreatePieChart();
	CreateLineChart();
	datePickerInit();
	initResize();
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

			drop_down_block.animate({
				height: "50"
			}, 400, function() {
			// Animation complete.
			});

		}else{
			
			//drop_down_block.height('auto');

			var curHeight = drop_down_block.height();
			drop_down_block.css('height', 'auto');
			var autoHeight = drop_down_block.height();
			drop_down_block.height(curHeight);

			$(this).addClass('box_rotate');

			drop_down_block.animate({
				height: autoHeight
			}, 400, function() {
			// Animation complete.
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
	}
}

function datePickerInit(){

	/* #double_datepicker */

	$('#double_datepicker').DatePicker({
		flat: true,
		date: ['2015-09-10','2015-09-16'],
		current: '2015-09-16',
		calendars: 1,
		mode: 'range',
		starts: 1,
		onChange: function(formated, dates){
			console.log(formated);
			$('#date').html(formated);
		}
	});

	$( "#double_datepicker" ).css("display", "none");

	$(".choose_period").click(
	function() {
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

	/* #single_datepicker */

	$('#single_datepicker').DatePicker({
		flat: true,
		date: '2015-09-10',
		current: '2015-09-16',
		calendars: 1,
		mode: 'single',
		starts: 1,
		onChange: function(formated, dates){
			console.log(formated);
			$('#date').html(formated);
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

	/* -------------------- */


	function calendarMerge(){
		$('.drop_down_block_calendar_date').each(function() {
			if ( $(this).width() > "220"){
				$(this).find('.drop_down_block_calendar_id').css({
					'right' : '-25px'
				});

				$(this).find('.datepickerBorderTArrow').css({
					'right': '10px'
				});
			}else{
				var dif = 220 - $(this).width();
				console.log(dif);
				$(this).find('.drop_down_block_calendar_id').css({
					'right' : dif + 'px'
				});

				$(this).find('.datepickerBorderTArrow').css({
					'right': '10px'
				});
			}
		});
	}

}
