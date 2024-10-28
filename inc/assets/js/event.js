jQuery(document).ready(function($) {

	var lang = $('#main').data('language');
	var p_lbls = {
					'required_fld':{
									'en':'Required field',
									'ar':'حقل إجباري'
									},
					'pin_empty':{
									'en':'Enter pin',
									'ar':'أدخل الرمز'
									},
					'pin_mismatch':{
									'en':'Wrong pin',
									'ar':'خطأ في الرمز'
									},
					'lbl_days':{
									'en':'Days',
									'ar':'يوم'
								},
					'lbl_hrs':{
									'en':'Hours',
									'ar':'ساعة'
								},
					'lbl_mins':{
									'en':'Minutes',
									'ar':'دقيقة'
								},
					'lbl_secs':{
									'en':'Seconds',
									'ar':'ثانية'
								},
					'lbl_np_zero':{
									'en':'Number of attendees can\'t be zero',
									'ar':'لا يمكن أن يكون عدد الحاضرين صفرًا'
								},
					'lbl_np_max':{
									'en':'Number of attendees can\'t be more than ',
									'ar':'لا يمكن أن يكون عدد الحاضرين أكثر من '
								},
					'lbl_already_RSVP':{
						'en':'you have already sent your RSVP',
						'ar':'لقد قمت بالرد مسبقاً'
					            },
					'emojis_error':{
						'en':'Please enter text without emojis',
						'ar':'الرجاء إدخال نص بدون رموز تعبيرية (emojis)'
						},
					'maxlength_error':{
						'en':'The message can\'t be more than 120 characters',
						'ar':'لا يمكن أن يكون نص الرسالة أكثر من 120 حرفًا'
						}
							};

	appHeight(tplID);

	$(".HeroSlider_wrapper").on('init', function(event, slick, direction){
		setTimeout(function(){
			$(".HeroSlider_wrapper").addClass('ini_zoom');
		},300);

	});

/*	$(".HeroSlider_wrapper").slick({
		'arrows':false,
		'fade':true,
		'autoplay':true,
		'autoplaySpeed':6000,
		'pauseOnFocus':false,
		'pauseOnHover':false,
		'touchMove':false,
		'draggable':false

	});*/


	var VerticalNav = false;
	var Verticalswipe = false;


	if($(window).width()>1024 || isVertical){
		VerticalNav = true;
		Verticalswipe = true;
	}
	// $('.ct_slider .story_slide.spacerSlide').remove();
	var storySlider = $(".ct_slider #story_slider");
	storySlider.slick({
		'arrows':false,
		'dots':false,
		'slidesToShow': 1,
		'slidesToScroll': 1,
		'infinite': false,
		'pauseOnFocus':false,
		'pauseOnHover':false,
		'vertical': VerticalNav,
		'verticalSwiping':Verticalswipe,
		'autoplay':false

	});

	//Advanced Slick CustomAutoPlay
	if(evAutoplaySpeed && evAutoplaySpeed > 0){
		if ($('#audioLockScreen').length === 0) {
			customAutoPlay(evAutoplaySpeed);
		}
	}


	if(evAutoPlay && $('#ios_audio_lockscreen').length){
		storySlider.slick('slickPause');
	}

	storySlider.on('wheel', (function(e) {
	  e.preventDefault();

	  if (e.originalEvent.deltaY < 0) {
		$(this).slick('slickPrev');
	  } else {

		$(this).slick('slickNext');
	  }
	}));


	slidesCount = $("#story_slider .story_slide").length - 1;

	var audio_flag = 0;
	var bgAudio = document.getElementById('bgmusic');

	$(".ct_slider #story_slider").on('beforeChange', function(e, slick, currentSlide, nextSlide){
	  //console.log(nextSlide);
	  if(nextSlide != 0){
		 $('.introLineTXT_parent').addClass('hideIntroLine');
		 $('.intro_screen').addClass('dim');
		  if($('#music_player_BTN').length>0){
			 $('#music_player_BTN').addClass('showAudioBtn');
		  }
		 if($('#bgmusic').length>0){
			 if(audio_flag == 0){
		 		bgAudio.play();
			 }
			 audio_flag++;

		 }

	   }else{
		 $('.introLineIMG, .introLineTXT_parent').removeClass('hideIntroLine');
		 $('.intro_screen').removeClass('dim');
		 if($('#music_player_BTN').length>0){
			 $('#music_player_BTN').removeClass('showAudioBtn');
		 }
	   }
	  if(nextSlide == slidesCount){
		  setTimeout(function(){
			  $('.ct_slider #sec_story').addClass('showPoweredBy');
	      },300);
	   }else{
		 $('.ct_slider #sec_story').removeClass('showPoweredBy');
	   }


		var sn_el = slick.$slides.get(nextSlide);
	    if($(sn_el).hasClass('IMGslide')){
		   $(sn_el).addClass('animIMG');
	    }
		setTimeout(function(){
			$(sn_el).siblings().removeClass('animIMG');
		},300);


		var progress = (nextSlide/slidesCount) * 100;
		$('.progress_bar .progress_state').css('width',progress+'%');


	});


	$('form#rsvp-event input, form#rsvp-event select').on('focus',function(){
		if(evAutoPlay){
			storySlider.slick('slickPause');
		}
		console.log('form focus');
	});

	var isAttending = false;
	$('.form-field select#guests').on('change',function(){
		if(isNPvar){
			var np_selection = $(this).val();

			if(np_selection == 1){
				$('.form-field.fld-npersons').fadeIn();
				isAttending = true;
				$(this).addClass('selected');
			}else{
				$('.form-field.fld-npersons').fadeOut();
				isAttending = false;
				$('input#npersons').val('');
				$(this).removeClass('selected');
			}
		}
	});

	$('.form-field select#npersons').on('change',function(){
		var nguest_selection = $(this).val();
		if(nguest_selection){
			$(this).addClass('selected');
		}else{
			$(this).removeClass('selected');
		}
	});




	//submit RSVP
	var rsvp_npersons = null;
	$('form#rsvp-event').on('submit',function(e){
		var isValid = true;
		if($('div.fld_error').length>0){
			$('div.fld_error').remove();
		}
		$('input#full_name, select#guests').removeClass('error_input');
		var rsvp_name_ini = $('input#full_name').val();
		rsvp_name = removeEmojis(rsvp_name_ini);

		var rsvp_guests = $('select#guests').val();
		var rsvp_email = $('input#rsvp_email').val();

		var couple_name = $('input#couple_name').val();
		var cardID = $('input#nid').val();
		var uid = $('input#uid').val();
		var override_nid = $('input#override_nid').val();
		var wed_date = $('input#wed_date').val();
		var cmessage = $('form .form-field #message').val();
		var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g

		if (emojiRegex.test(cmessage)) {
			isValid = false;
			$('form .form-field #message').parent().append('<div class="fld_error">'+p_lbls.emojis_error[lang]+'</div>');
			$('form .form-field #message').addClass('error_input');
		}

		if(isNPvar){
		 rsvp_npersons = $('select#npersons').val();
		}

		if(rsvp_name == ''){
			isValid = false;
			$('input#full_name').parent().append('<div class="fld_error">'+p_lbls.required_fld[lang]+'</div>');
			$('input#full_name').addClass('error_input');
		}
		if(rsvp_guests == ''){
			isValid = false;
			$('select#guests').parent().append('<div class="fld_error">'+p_lbls.required_fld[lang]+'</div>');
			$('select#guests').addClass('error_input');
		}
		if(isNPvar){
			if(isAttending){
				if(rsvp_npersons == ''){
					isValid = false;
					$('select#npersons').parent().append('<div class="fld_error">'+p_lbls.required_fld[lang]+'</div>');
					$('select#npersons').addClass('error_input');
				}
				else{
					if(rsvp_npersons < 1){
						isValid = false;
						$('select#npersons').parent().append('<div class="fld_error">'+p_lbls.lbl_np_zero[lang]+'</div>');
						$('select#npersons').addClass('error_input');
					}
					if(rsvp_npersons > npCount){
						isValid = false;
						$('select#npersons').parent().append('<div class="fld_error">'+p_lbls.lbl_np_max[lang]+npCount+'</div>');
						$('select#npersons').addClass('error_input');
					}

				}



            }
		}


		if(isValid){
			//alert('good');
			rsvp_name = Base64.encode(''+rsvp_name+'');
			couple_name = Base64.encode(''+couple_name+'');
			cmessage = Base64.encode(''+cmessage+'');
			var _data = {"name":rsvp_name, "guests":rsvp_guests, "email":rsvp_email, "title":couple_name,"nid":cardID, "override_nid":override_nid, "uid":uid,"wed_date":wed_date,"n_persons":rsvp_npersons,"message":cmessage};
			_data = JSON.stringify(_data);
			console.log(_data);

			var postData = "pdata="+_data;
			console.log(postData);

			$('form#rsvp-event').addClass('lock-form');


			//if(!$.cookie('RSVPstate')){

			$.ajax({
				type: "POST",
				url: '/rsvp',
				dataType: 'json',
				data: postData, // serializes the form's elements.
				success: function(data)
				  {
					 console.log(data);
					 if(data.status){
						 RSVP_success_msg(data.msg);
						 $('form#rsvp-event').removeClass('lock-form');
						 //$.cookie('RSVPstate', '1');

						if(evAutoPlay){
							storySlider.slick('slickPlay');
						}
					 }else{
						 //alert('Something went wrong, please try again');
						 RSVP_success_msg(data.msg);
						  $('form#rsvp-event').removeClass('lock-form');
						if(evAutoPlay){
							storySlider.slick('slickPlay');
						}
					 }
				  },
				 error: function(){
					alert('Error: Something went wrong, please try again');
					 $('form#rsvp-event').removeClass('lock-form');
				 }
			});
			// JavaScript Document

		//}else{
		//	$('form#rsvp-event').removeClass('lock-form');
		//	var cardlang = $('#main').data('language');
		//	RSVP_success_msg(p_lbls.lbl_already_RSVP[cardlang]);

		//}



		}

		e.preventDefault();

	 });


	 $('form#unlock_preview').on('submit',function(e){

		var db_pin = $('form#unlock_preview input#db_pass').val();
		var entered_pin = $('form#unlock_preview input#password').val();
		entered_pin = entered_pin.toLowerCase();

		$('form#unlock_preview span.form-error').remove();

		var Validpin = true;
		var pin_msg = '';

		if(entered_pin == ''){
			Validpin = false;
			pin_msg = p_lbls.pin_empty[lang];
		}else{
			if(entered_pin != db_pin){
				Validpin = false;
				pin_msg = p_lbls.pin_mismatch[lang];
			}
		}

		if(Validpin){
			$('.event_lock').fadeOut();
		}else{

			$(this).append('<span class="form-error">'+pin_msg+'</span>');
		}

		 e.preventDefault();
	 });



	var deadline = $('#clock_wed').data('deadline');


$('#clockTimer').countdown(deadline, function(event) {

	var clkHTML =''
	+'<div id="tdays" class="tcell t_days">'
		+'<span class="t_val daysVal">%D</span>'
		+'<span class="t_label">'+p_lbls.lbl_days[lang]+'</span>'
	 +'</div>'
	+'<div id="thours" class="tcell t_hours">'
		+'<span class="t_val hoursVal">%H</span>'
		+'<span class="t_label">'+p_lbls.lbl_hrs[lang]+'</span>'
	 +'</div>'
	+'<div id="tmins" class="tcell t_mins">'
		+'<span class="t_val minsVal">%M</span>'
		+'<span class="t_label">'+p_lbls.lbl_mins[lang]+'</span>'
	+'</div>'
	+'<div id="tsecs" class="tcell t_secs">'
		+'<span class="t_val secsVal">%S</span>'
		+'<span class="t_label">'+p_lbls.lbl_secs[lang]+'</span>'
	 +'</div>';

	 if(lang=='ar'){
	clkHTML =''
	+'<div id="tsecs" class="tcell t_secs">'
		+'<span class="t_val secsVal">%S</span>'
		+'<span class="t_label">'+p_lbls.lbl_secs[lang]+'</span>'
	 +'</div>'
	+'<div id="tmins" class="tcell t_mins">'
		+'<span class="t_val minsVal">%M</span>'
		+'<span class="t_label">'+p_lbls.lbl_mins[lang]+'</span>'
	+'</div>'
	+'<div id="thours" class="tcell t_hours">'
		+'<span class="t_val hoursVal">%H</span>'
		+'<span class="t_label">'+p_lbls.lbl_hrs[lang]+'</span>'
	 +'</div>'
	+'<div id="tdays" class="tcell t_days">'
		+'<span class="t_val daysVal">%D</span>'
		+'<span class="t_label">'+p_lbls.lbl_days[lang]+'</span>'
	 +'</div>';
	 }



  var $this = $(this).html(event.strftime(clkHTML)).on('finish.countdown', function(event) {

		 	$('#clock_wed').remove();
	});
});

$('#music_player_BTN').on('click',function(){
	togglePause();
});


//IOS Audio Hack
//var iOS = !!navigator.platform && /iPad|iPhone|iPod|Android/.test(navigator.platform);

//console.log(iOS);
if(IsMobile() && $('#ios_audio_lockscreen').length>0){
	$('#ios_audio_lockscreen').css('display','block');
	$('.main_wrapper').addClass('iosAudio');

	$('.ct_article #sec_story').css('opacity',0);
}

var GuestName_fld_val = '';
//start card
$('#ios_audio_lockscreen').on('click',function(){

    if ($('body').hasClass('ct_article')) {
		$("html, body").scrollTop(0);

		$('.ct_article #sec_story').css('opacity',1);

		RunSwipeUpHelper();
	}

	var myAudio_start = document.getElementById('bgmusic');
	if(myAudio_start){
		myAudio_start.play();
	}

	$(this).fadeOut(300);
	setTimeout(function(){
		$('.main_wrapper').removeClass('iosAudio');
		$('.story_slide.helperSlide').addClass('hlpIndicShow');
	},400);

	if(evAutoPlay){
		customAutoPlay(evAutoplaySpeed);
	}

	GuestName_fld_val = $('.form-wrapper .guestNames_dyn_wrapper').text();
	$('form .form-field #full_name').val(GuestName_fld_val);

	$(".HeroSlider_wrapper").slick('slickPlay');

	//TriggerPrompt();

	if(!isCoverPhoto){
		if(evtCount > evBGSliderSpeed ){
			console.log('jump to next slide');
			$(".HeroSlider_wrapper").slick('slickNext');

		}else{
			console.log('do nothing');
		}
		clearInterval(evTimer);
	}

	if($('.ct_article #music_player_BTN').length>0){
		$('.ct_article #music_player_BTN').addClass('showAudioBtn');
	 }

	 PlayBgVido();
	 BufferVideo(VideoBufferPercent);

	RunPrompter();

});//end start INTRO Click

//SlideBg();


$('form .form-field #message').on('input blur', function() {
	var maxLength = 120;
	var currentLength = $(this).val().length;
	var charactersLeft = maxLength - currentLength;

	$('#msg_charCount #c_current').text(currentLength);
	if(currentLength>120){
		$('#msg_charCount #c_current').text('120');
	}


	if (currentLength > maxLength) {
		$(this).val($(this).val().slice(0, maxLength));

	}
});

/** helper animation display script **/
$('.prompt').fadeOut();

/* end helper animation script */


	RunSwipeUpHelper();


	$('video#vidbgcomp').addClass('hideVideo');



});//end ready function


jQuery(document).ready(function($) {

	$('#preloaderCont').fadeOut();
	$('form .form-field #full_name, form .form-field #npersons, .form-field select#guests').val('');
	//$('form .form-field #npersons, .form-field select#guests').val('');
	$('form .form-field.fld-npersons').hide();

	$(".HeroSlider_wrapper").slick('slickPause');

	evtCount = 0;
	evTimer = setInterval(function(){
		evtCount++;
	},1000);

	if(!$('#ios_audio_lockscreen').length){
		RunPrompter();
	}

	if(!IsMobile()){
		$(".HeroSlider_wrapper").slick('slickPlay');
		PlayBgVido();
		BufferVideo(VideoBufferPercent);
	}

});//end window load

$(window).on('resize', function () {
	appHeight(tplID);
});

function PlayBgVido(){
	if($('video#vidbgcomp').length>0){
		$('#vidbgcomp')[0].play();
	}
}

function restartVideo() {
	var BGvideo = document.getElementById("vidbgcomp");
	BGvideo.currentTime = 0; // Seek to the beginning
	BGvideo.play(); // Start playback
  }

function isBuffered(BufferLimit) {

  var vbLimit = BufferLimit;
  if(BufferLimit<1){
	vbLimit = 1;
  }
  if(BufferLimit>99){
	vbLimit = 99;
  }
  var BGvideo = document.getElementById("vidbgcomp");
  if (BGvideo.buffered.length > 0) {
    var buffered = BGvideo.buffered.end(0);
    var duration = BGvideo.duration;
    var bufferedPercentage = (buffered / duration) * 100;

    // Check if at least 50% of the video is buffered
    return bufferedPercentage >= BufferLimit;
  }
  return false; // Return false if no buffered data available
}

function BufferVideo(per_buffer_val){
	if($('video#vidbgcomp').length>0){
		var vidBufferTimer = setInterval(function(){

			if (isBuffered(per_buffer_val)) {
				console.log("buffer threshold reached.");
				clearInterval(vidBufferTimer);
				$('video#vidbgcomp').removeClass('hideVideo');
				restartVideo();

			  } else {
				console.log("below buffer threshold");
			  }

		},500);
	}//if video exist
}


function IsMobile(){
	var isMobile = false;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	isMobile = true;
	}
	return isMobile;
}

function ShowPrompt(){
	$('.prompt').fadeIn();
	setTimeout(function(){
		$('.prompt').fadeOut();
	},5000);
}
function HideSwipeUp(){
	$('.prompt_swipeUp').fadeOut();
	$('.prompt_swipeUp').removeClass('isVisible');
}
function ShowSwipeUp(){
	$('.prompt_swipeUp').fadeIn();
	$('.prompt_swipeUp').addClass('isVisible');
	setTimeout(function(){
		HideSwipeUp();
	},6300);
}

function RunSwipeUpHelper(){

	HideSwipeUp();
	if ($('body').hasClass('ct_article')) {
		var _counter = 0;
		var scrollTimer = setInterval(function() {
			_counter++;
			if(_counter % 2 !== 0){
				if($("html, body").scrollTop()<100){
						ShowSwipeUp();
						//console.log('animation counter: '+_counter);
				}else{
					HideSwipeUp();
					clearInterval(scrollTimer);
				}
			}
		}, 6300); //repeat
	}

	$(window).on('scroll', function () {
		if($("html, body").scrollTop()>99){
			HideSwipeUp();
			clearInterval(scrollTimer);
		}
	});
}

function RunPrompter(){
	intervalId_start = null;
	setTimeout(function(){
		ShowPrompt();
		intervalId_start = setInterval(function() {
			  ShowPrompt();
		  }, 12000); //repeat every 12 sec

	},2000);


	  var storySlidesCount = $(".ct_slider #story_slider").slick('getSlick').slideCount;
	  var NeedPrompter = true;
	  intervalId = null;

	  $(".ct_slider #story_slider").on('afterChange', function() {
		$('.prompt').hide();
		  clearInterval(intervalId_start);
		  var userDidSwipe = false;

		  var current_slide_classes = $('.ct_slider #story_slider .slick-current').attr('class');
		  var ExecludeSlides = ['rsvp','endFrame'];

		  var containsExcludedValue = ExecludeSlides.some(value => current_slide_classes.includes(value));

		  if (!containsExcludedValue) {
			  console.log('The string does not contain any excluded value.');
			  if(NeedPrompter){
				  var timeoutId = setTimeout(function() {
					  if (!userDidSwipe) {
						  console.log('User did not swipe in 5 seconds');
						  // Your code to handle the case where the user didn't swipe
						  ShowPrompt();
						  intervalId = setInterval(function() {
							  if (!userDidSwipe) {
								// Show the alert if the user hasn't swiped
								ShowPrompt();
							  }
							}, 12000); //repeat every 12 sec
					  }
					  }, 5000);
				  }//end if need prompter


		  } else {
			  console.log('The string contains an excluded value.');
			  NeedPrompter = false;
		  }
			  // Set a timeout to check if the user swiped within 5 seconds

		  $(".ct_slider #story_slider").on('afterChange', function() {
			  // Clear the timeout and update the flag when the user swipes
			  $('.prompt').hide();
			  clearTimeout(timeoutId);
			  clearInterval(intervalId);
			  userDidSwipe = true;
			  console.log('prompter afterChange');
		  });


		  $(".ct_slider #story_slider").on('beforeChange', function() {
			  // Clear the timeout and update the flag when the user swipes
			  $('.prompt').hide();
			  console.log('prompter beforeChange');
		  });
	  });


}//end Runprompter

function togglePause() {
	var myAudio = document.getElementById('bgmusic');
	 return myAudio.paused ? myAudio.play() : myAudio.pause();
}


function SlideBg(){

	var imgMob,imgDesk;
	$('.ct_slider .story_slide').each(function(index, element) {

		imgMob = $(this).data('bgmob');
		imgDesk = $(this).data('bgdesk');

		if($(window).width()>768){
			$(this).css('background-image','url('+imgDesk+')');
		}else{
			$(this).css('background-image','url('+imgMob+')');
		}


    });//end foreach
}


function appHeight(opt){

	var idealHeight = 635;
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	var appframe_height = windowHeight;
	var appframe_width = windowWidth;

	if(windowHeight<490 && windowWidth>700){
		appframe_height = idealHeight;
	}
	else if(windowHeight>636 && windowWidth>769){
		appframe_height = idealHeight;
	}
	else{
		appframe_height = windowHeight;
	}

	if(windowWidth > 680){
		appframe_width = 375;
	}else{
		appframe_width = windowWidth;
	}


	$('.ct_slider #main .main_wrapper, .ct_slider .story_slide').css('height',appframe_height+'px');
	$('#main .main_wrapper, .ct_article #sec_intro').css('width',appframe_width+'px');

}


function RSVP_success_msg(msg){
	$('.story_slide.rsvp .form-wrapper').addClass('onSuccess');
	$('.ajax_success_message_wrapper').html(msg);
}

function removeEmojis(inputString) {
	// Remove emojis using a regular expression
	return inputString.replace(/[\uD800-\uDFFF].|[\u200D\uFE0F]/g, '');
  }

 function customAutoPlay(PlaySpeed){

	var storySlider = $(".ct_slider #story_slider");
	StorySlidesCount = $("#story_slider .story_slide").length - 1;


	var storySliderTimer = setInterval(function(){
		storySlider.slick('next');
	},PlaySpeed);

	storySlider.on('afterChange', function() {
		CurrentSlideNum = storySlider.slick('slickCurrentSlide');
		if(CurrentSlideNum == StorySlidesCount -1){
			clearInterval(storySliderTimer);
		}

	});
 }


var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    // public method for encoding
    , encode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length)
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        } // Whend

        return output;
    } // End Function encode


    // public method for decoding
    ,decode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length)
        {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64)
            {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 != 64)
            {
                output = output + String.fromCharCode(chr3);
            }

        } // Whend

        output = Base64._utf8_decode(output);

        return output;
    } // End Function decode


    // private method for UTF-8 encoding
    ,_utf8_encode: function (string)
    {
        var utftext = "";
        string = string.replace(/\r\n/g, "\n");

        for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);

            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        } // Next n

        return utftext;
    } // End Function _utf8_encode

    // private method for UTF-8 decoding
    ,_utf8_decode: function (utftext)
    {
        var string = "";
        var i = 0;
        var c, c1, c2, c3;
        c = c1 = c2 = 0;

        while (i < utftext.length)
        {
            c = utftext.charCodeAt(i);

            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        } // Whend

        return string;
    } // End Function _utf8_decode

}