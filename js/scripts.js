'use strict';
var sapphire = function(){
	
	/* LOCAL VARIABLES */
	var $sections = null;
	var $nav = null;
	var $header = null;
	var nav_height = null;
	var isTouch = false;
	
	/* RESIZE BACKGROUND IMAGES */
	var backgroundResize = function (){
		var windowH = $(window).height();
		// variables
		var contW = $header.width();
		var contH = $header.height();
		var imgW = $header.attr("data-img-width");
		var imgH = $header.attr("data-img-height");
		var ratio = imgW / imgH;
		// overflowing difference
		var diff = parseFloat($header.attr("data-diff"));
		diff = diff ? diff : 0;
		// remaining height to have fullscreen image only on parallax
		var remainingH = 0;
		if($header.hasClass("parallax") && !isTouch){
			var maxH = contH > windowH ? contH : windowH;
			remainingH = windowH - contH;
		}
		// set img values depending on cont
		imgH = contH + remainingH + diff;
		imgW = imgH * ratio;
		// fix when too large
		if(contW > imgW){
			imgW = contW;
			imgH = imgW / ratio;
		}
		//
		$header.data("resized-imgW", imgW).data("resized-imgH", imgH).css("background-size", imgW + "px " + imgH + "px");
	};
	
	/* SET PARALLAX BACKGROUND-POSITION */
	var parallaxPosition = function(e){
		if(isTouch){return;}
		var heightWindow = $(window).height();
		var topWindow = $(window).scrollTop();
		var bottomWindow = topWindow + heightWindow;
		var currentWindow = (topWindow + bottomWindow) / 2;
		var height = $header.height();
		var top = $header.offset().top;
		var bottom = top + height;
		// only when in range
		if(bottomWindow > top && topWindow < bottom){
			var imgW = $header.data("resized-imgW");
			var imgH = $header.data("resized-imgH");
			// min when image touch top of window
			var min = 0;
			// max when image touch bottom of window
			var max = - imgH + heightWindow;
			// overflow changes parallax
			var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
			top = top - overflowH;
			bottom = bottom + overflowH;
			// value with linear interpolation
			var value = min + (max - min) * (currentWindow - top) / (bottom - top);
			// set background-position
			var horizontalPosition = $header.attr("data-oriz-pos");
			horizontalPosition = horizontalPosition ? horizontalPosition : "50%";
			$header.css("background-position", horizontalPosition + " " + value + "px");
		}
	};
	
	var scroll = function(){
		var scrollPosition = $(this).scrollTop();
		// COLLAPSE THE NAVBAR ON SCROLL
		if ($nav.offset().top > 100) {
			$nav.hasClass("navbar-fixed-top") ? $nav.addClass("top-nav-collapse") : $nav.addClass("top-nav-collapse-white");
		} else {
			$nav.hasClass("navbar-fixed-top") ? $nav.removeClass("top-nav-collapse") : $nav.removeClass("top-nav-collapse-white");
		}
		// FADE HERO TEXT
		$("#container-top").css("opacity", 1 - scrollPosition / 300);
		if (scrollPosition > 700) {
			$('#backtop').fadeIn(500); // Time(in Milliseconds) of appearing of the Button when scrolling down.
		} else {
			$('#backtop').fadeOut(500); // Time(in Milliseconds) of disappearing of Button when scrolling up.
		}

		$sections.each(function() {
			var top = $(this).offset().top - nav_height;
			var bottom = top + $(this).outerHeight();

			if (scrollPosition >= top && scrollPosition <= bottom) {
				$nav.find('a').removeClass('active');
				$sections.removeClass('active');
				$(this).addClass('active');
				$nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
			}
		});
		
		// Header - Parallax Explode Effect 
		var transY = (scrollPosition * 0.5), scale = 1 + (scrollPosition * 0.0003), transform = 'translateY(' + transY + 'px) scale(' + scale + ') translate3d(0,0,0)';
		$header.find('.header-parallax-bg').css({opacity: 1 - (scrollPosition * 0.0008),WebkitTransform: transform,MozTransform: transform,msTransform: transform,transform: transform});
	
		parallaxPosition(); 
	};
		
	var textFade = function(){
		var texthd = $(".texthd");
		var texthdIndex = -1;
		
		function showNextTexthd() {
			++texthdIndex;
			texthd.eq(texthdIndex % texthd.length).fadeIn(2000).delay(1000).fadeOut(2000, showNextTexthd);
		}
		
		showNextTexthd();
	};
	
	var init = function(){
		// Preloader
		$(window)
			.on("load", function() { $("#preloader").fadeOut(1000); })
			.on("scroll", scroll)
			.on("resize, focus", function(){ backgroundResize(); parallaxPosition(); });

		$sections = $('section');
		$header = $('#header-parallax');
		$nav = $('#navbar');		
		nav_height = $nav.find("nav").outerHeight();

		// Touch screen device
		if("ontouchstart" in window){
			document.documentElement.className = document.documentElement.className + " touch";
			isTouch = true;
		}

		// WOW Animate
		new WOW().init();
		
		// Header Text Fade Effect
		textFade();

		$(this).scrollTop(0);
		
		// Popover button
		$("[data-toggle=popover]").popover({html: true});

		// POPUP VIDEO
		$('#video-popup').magnificPopup({disableOn: 700, type: 'iframe', removalDelay: 300, mainClass: 'mfp-fade', preloader: false, fixedContentPos: false });

		/* BACKGROUND FIX FOR DIFFERENT SCREEN SIZES */
		backgroundResize();
		parallaxPosition(); 

		//EVENT BINDING
		
		//PAGE SCROLLING FEATURE
		$('a.page-scroll').on("click", function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});

		// BACK TO TOP BUTTON | BACK TO TOP BORDER  
		// SMOOTH ANIMATION WHEN SCROLLING
		$('#backtop').on("click", function(event) {
			event.preventDefault();
			$('html, body').animate({ scrollTop: 0}, 900);
		});

		// NAVBAR - CLOSES THE RESPONSIVE MENU
		$nav.find('ul li a').on("click", function() { $('.navbar-toggle:visible').click(); });

		// NAVBAR - DROPDOWN MENU HOVER 
		$nav.find('ul li.dropdown').hover(function() {
		   $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
		 }, function() {
		   $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
		});
		
		// ACTIVE STATE OF LINKS IN NAVIGATION ON SCROLL
		// REMOVE LOAD MORE BUTTON ON CLICK
		$('#more-lnk').on("click", function(){ $(this).parent().remove(); });

		if(!isTouch){ $("#header-parallax").css("background-attachment", "fixed"); }
		
		//CONTACT FORM INIT
		$('#name').on("focus", function() { $('#success').html(''); });
		
		//SETUP JQBOOTSTRAPVALIDATION IN CONTACT FORM.
		//SUBMIT AND ERROR CHECKING
		$("input,textarea").jqBootstrapValidation({ 
			preventSubmit: true, 
			submitError: function($form, event, errors) { 
				// SOMETHING TO DO WHEN SUBMIT PRODUCES AN ERROR...
				// NOT NEEDED, LEFT FOR EXTENSION PURPOSES...
			},
			submitSuccess: function($form, event) {
				event.preventDefault();
				
				var name = $("input#name").val();  
				var email = $("input#email").val(); 
				var message = $("textarea#message").val();
				var firstName = name;
				// CHECK FOR WHITE SPACE IN NAME FOR SUCCESS/FAILURE MESSAGE
				if (firstName.indexOf(' ') >= 0) {
					firstName = name.split(' ').slice(0, -1).join(' ');
				}       
				var $succ = $('#success');				
				$.ajax({
					url: "contact_me.php",
					type: "POST",
					data: {name: name, email: email, message: message},
					cache: false,
					success: function() {  
						$succ.html("<div class='alert alert-success'>");
						$succ.find('.alert-success').html("").append( "</button>").append("Success! Your message has been sent.").append('</div>');
										
						$('#contactForm').trigger("reset");
					},
					error: function() {		
						$succ.html("<div class='alert alert-danger'>");
						$succ.find('.alert-danger').html("").append( "</button>").append("WHOA! Sorry "+firstName+", it seems my email system is having a moment... Please email me directly to <a href='mailto:me@example.com'>me@example.com</a>.").append('</div>');
						$('#contactForm').trigger("reset");
					}
				});
			},
			filter: function() {
			   return $(this).is(":visible");
			}
		});

		return this;
	}

	return init();
};

var app; 
$(document).ready(function(){
	app = (app || new sapphire());
});