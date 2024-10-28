$(document).ready(function (e) {
	var lang = $("#main").data("language");

	var p_lbls = {
	  required_fld: {
		en: "Required field",

		ar: "Ø­Ù‚Ù„ Ø¥Ø¬Ø¨Ø§Ø±ÙŠ",
	  },

	  pin_empty: {
		en: "Enter pin",

		ar: "Ø£Ø¯Ø®Ù„ Ø§Ù„Ø±Ù…Ø²",
	  },

	  pin_mismatch: {
		en: "Wrong pin",

		ar: "Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø±Ù…Ø²",
	  },

	  lbl_days: {
		en: "Days",

		ar: "ÙŠÙˆÙ…",
	  },

	  lbl_hrs: {
		en: "Hours",

		ar: "Ø³Ø§Ø¹Ø©",
	  },

	  lbl_mins: {
		en: "Minutes",

		ar: "Ø¯Ù‚ÙŠÙ‚Ø©",
	  },

	  lbl_secs: {
		en: "Seconds",

		ar: "Ø«Ø§Ù†ÙŠØ©",
	  },

	  lbl_np_zero: {
		en: "Number of attendees can't be zero",

		ar: "Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø£Ù† ÙŠÙƒÙˆÙ† Ø¹Ø¯Ø¯ Ø§Ù„Ø­Ø§Ø¶Ø±ÙŠÙ† ØµÙØ±Ù‹Ø§",
	  },

	  lbl_np_max: {
		en: "Number of attendees can't be more than ",

		ar: "Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø£Ù† ÙŠÙƒÙˆÙ† Ø¹Ø¯Ø¯ Ø§Ù„Ø­Ø§Ø¶Ø±ÙŠÙ† Ø£ÙƒØ«Ø± Ù…Ù† ",
	  },

	  lbl_already_RSVP: {
		en: "you have already sent your RSVP",

		ar: "Ù„Ù‚Ø¯ Ù‚Ù…Øª Ø¨Ø§Ù„Ø±Ø¯ Ù…Ø³Ø¨Ù‚Ø§Ù‹",
	  },
	};

	appHeight(tplID);

	$(".HeroSlider_wrapper").on("init", function (event, slick, direction) {
	  setTimeout(function () {
		$(".HeroSlider_wrapper").addClass("ini_zoom");
	  }, 300);
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

	if ($(window).width() > 1024 || isVertical) {
	  VerticalNav = true;

	  Verticalswipe = true;
	}

	var storySlider = $("#story_slider");

	storySlider.slick({
	  arrows: false,

	  dots: false,

	  slidesToShow: 1,

	  slidesToScroll: 1,

	  infinite: false,

	  pauseOnFocus: false,

	  pauseOnHover: false,

	  vertical: VerticalNav,

	  verticalSwiping: Verticalswipe,

	  autoplay: evAutoPlay,

	  autoplaySpeed: evAutoplaySpeed,

	  infinite: evInfinteLoop,
	});

	if (evAutoPlay && $("#ios_audio_lockscreen").length) {
	  storySlider.slick("slickPause");
	}

	storySlider.on("wheel", function (e) {
	  e.preventDefault();

	  if (e.originalEvent.deltaY < 0) {
		$(this).slick("slickPrev");
	  } else {
		$(this).slick("slickNext");
	  }
	});

	slidesCount = $("#story_slider .story_slide").length - 1;

	var audio_flag = 0;

	var bgAudio = document.getElementById("bgmusic");

	$("#story_slider").on(
	  "beforeChange",
	  function (e, slick, currentSlide, nextSlide) {
		//   console.log(nextSlide);

		if (nextSlide != 0) {
		  $(".introLineIMG, .introLineTXT").addClass("hideIntroLine");

		  $(".intro_screen").addClass("dim");

		  if ($("#music_player_BTN").length > 0) {
			$("#music_player_BTN").addClass("showAudioBtn");
		  }

		  if ($("#bgmusic").length > 0) {
			if (audio_flag == 0) {
			  bgAudio.play();
			}

			audio_flag++;
		  }
		} else {
		  $(".introLineIMG, .introLineTXT").removeClass("hideIntroLine");

		  $(".intro_screen").removeClass("dim");

		  if ($("#music_player_BTN").length > 0) {
			$("#music_player_BTN").removeClass("showAudioBtn");
		  }
		}

		if (nextSlide == slidesCount) {
		  setTimeout(function () {
			$("#sec_story").addClass("showPoweredBy");
		  }, 300);
		} else {
		  $("#sec_story").removeClass("showPoweredBy");
		}

		var sn_el = slick.$slides.get(nextSlide);

		if ($(sn_el).hasClass("IMGslide")) {
		  $(sn_el).addClass("animIMG");
		}

		setTimeout(function () {
		  $(sn_el).siblings().removeClass("animIMG");
		}, 300);

		var progress = (nextSlide / slidesCount) * 100;

		$(".progress_bar .progress_state").css("width", progress + "%");
	  }
	);

	$("form#rsvp-event input, form#rsvp-event select").on("focus", function () {
	  if (evAutoPlay) {
		storySlider.slick("slickPause");
	  }
	});

	var isAttending = false;

	$(".form-field select#guests").on("change", function () {
	  if (isNPvar) {
		var np_selection = $(this).val();

		if (np_selection == "Yes") {
		  $(".form-field.fld-npersons").fadeIn();

		  isAttending = true;
		} else {
		  $(".form-field.fld-npersons").fadeOut();

		  isAttending = false;

		  $("input#npersons").val("");
		}
	  }
	});

	//submit RSVP

	var rsvp_npersons = null;
	var npCount = 0;
	$("#npersons").change(function () {
	  npCount = $(this).children("option:selected").val();
	});
	$("form#rsvp-event").on("submit", function (e) {
	  var isValid = true;
	  if ($("div.fld_error").length > 0) {
		$("div.fld_error").remove();
	  }
	  $("input#full_name, select#guests").removeClass("error_input");

	  var rsvp_name = $("input#full_name").val();

	  var rsvp_guests = $("select#guests").val();

	  var rsvp_email = $("input#rsvp_email").val();

	  var couple_name = $("input#couple_name").val();

	  var cardID = $("input#nid").val();

	  var wed_date = $("input#wed_date").val();

	  if (isNPvar) {
		rsvp_npersons = npCount;
	  }

	  if (rsvp_name == "") {
		isValid = false;

		$("input#full_name")
		  .parent()
		  .append(
			'<div class="fld_error">' + p_lbls.required_fld[lang] + "</div>"
		  );

		$("input#full_name").addClass("error_input");
	  }

	  if (rsvp_guests == "") {
		isValid = false;

		$("select#guests")
		  .parent()
		  .append(
			'<div class="fld_error">' + p_lbls.required_fld[lang] + "</div>"
		  );

		$("select#guests").addClass("error_input");
	  }

	  if (isNPvar) {
		if (isAttending) {
		  if (rsvp_npersons == "") {
			isValid = false;

			$("select#npersons")
			  .parent()
			  .append(
				'<div class="fld_error">' + p_lbls.required_fld[lang] + "</div>"
			  );

			$("select#npersons").addClass("error_input");
		  } else {
			if (rsvp_npersons < 1) {
			  isValid = false;

			  $("select#npersons")
				.parent()
				.append(
				  '<div class="fld_error">' + p_lbls.lbl_np_zero[lang] + "</div>"
				);

			  $("select#npersons").addClass("error_input");
			}

			if (rsvp_npersons > npCount) {
			  isValid = false;

			  $("select#npersons")
				.parent()
				.append(
				  '<div class="fld_error">' +
					p_lbls.lbl_np_max[lang] +
					npCount +
					"</div>"
				);

			  $("select#npersons").addClass("error_input");
			}
		  }
		}
	  }

	  if (isValid) {
		// rsvp_name = Base64.encode("" + rsvp_name + "");
		// couple_name = Base64.encode("" + couple_name + "");
		var _data = {
		  name: rsvp_name,
		  guests: rsvp_guests,
		  email: rsvp_email,
		  title: couple_name,
		  nid: cardID,
		  wed_date: wed_date,
		  n_persons: rsvp_npersons,
		};
		console.log(_data);
		// _data = JSON.stringify(_data);
		// var postData = "pdata=" + _data;
		// console.log(postData);
		$("form#rsvp-event").addClass("lock-form");

		if (!$.cookie("RSVPstate")) {
		  const data = _data;
		  $.ajax({
			url: "https://sarpysevents.com/rsvp/",
			type: "POST",
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json",
			success: function (data) {
			  if (data !== null) {
				RSVP_success_msg(data.msg);
				$("form#rsvp-event").removeClass("lock-form");
				$.cookie("RSVPstate", "1");
				if (evAutoPlay) {
				  storySlider.slick("slickPlay");
				}
			  } else {
				alert("Something went wrong, please try again");
				$("form#rsvp-event").removeClass("lock-form");
				if (evAutoPlay) {
				  storySlider.slick("slickPlay");
				}
			  }
			},
			error: function () {
			  RSVP_success_msg(data.msg);
			  $("form#rsvp-event").removeClass("lock-form");
			  $.cookie("RSVPstate", "1");
			  if (evAutoPlay) {
				storySlider.slick("slickPlay");
			  }
			},
		  });

		  // JavaScript Document
		} else {
		  $("form#rsvp-event").removeClass("lock-form");

		  var cardlang = $("#main").data("language");

		  RSVP_success_msg(p_lbls.lbl_already_RSVP[cardlang]);
		}
	  }

	  e.preventDefault();
	});

	$("form#unlock_preview").on("submit", function (e) {
	  var db_pin = $("form#unlock_preview input#db_pass").val();

	  var entered_pin = $("form#unlock_preview input#password").val();

	  entered_pin = entered_pin.toLowerCase();

	  $("form#unlock_preview span.form-error").remove();

	  var Validpin = true;

	  var pin_msg = "";

	  if (entered_pin == "") {
		Validpin = false;

		pin_msg = p_lbls.pin_empty[lang];
	  } else {
		if (entered_pin != db_pin) {
		  Validpin = false;

		  pin_msg = p_lbls.pin_mismatch[lang];
		}
	  }

	  if (Validpin) {
		$(".event_lock").fadeOut();
	  } else {
		$(this).append('<span class="form-error">' + pin_msg + "</span>");
	  }

	  e.preventDefault();
	});

	var deadline = $("#clock_wed").data("deadline");

	$("#clockTimer").countdown(deadline, function (event) {
	  var clkHTML =
		"" +
		'<div id="tdays" class="tcell t_days">' +
		'<span class="t_val daysVal">%D</span>' +
		'<span class="t_label">' +
		p_lbls.lbl_days[lang] +
		"</span>" +
		"</div>" +
		'<div id="thours" class="tcell t_hours">' +
		'<span class="t_val hoursVal">%H</span>' +
		'<span class="t_label">' +
		p_lbls.lbl_hrs[lang] +
		"</span>" +
		"</div>" +
		'<div id="tmins" class="tcell t_mins">' +
		'<span class="t_val minsVal">%M</span>' +
		'<span class="t_label">' +
		p_lbls.lbl_mins[lang] +
		"</span>" +
		"</div>" +
		'<div id="tsecs" class="tcell t_secs">' +
		'<span class="t_val secsVal">%S</span>' +
		'<span class="t_label">' +
		p_lbls.lbl_secs[lang] +
		"</span>" +
		"</div>";

	  if (lang == "ar") {
		clkHTML =
		  "" +
		  '<div id="tsecs" class="tcell t_secs">' +
		  '<span class="t_val secsVal">%S</span>' +
		  '<span class="t_label">' +
		  p_lbls.lbl_secs[lang] +
		  "</span>" +
		  "</div>" +
		  '<div id="tmins" class="tcell t_mins">' +
		  '<span class="t_val minsVal">%M</span>' +
		  '<span class="t_label">' +
		  p_lbls.lbl_mins[lang] +
		  "</span>" +
		  "</div>" +
		  '<div id="thours" class="tcell t_hours">' +
		  '<span class="t_val hoursVal">%H</span>' +
		  '<span class="t_label">' +
		  p_lbls.lbl_hrs[lang] +
		  "</span>" +
		  "</div>" +
		  '<div id="tdays" class="tcell t_days">' +
		  '<span class="t_val daysVal">%D</span>' +
		  '<span class="t_label">' +
		  p_lbls.lbl_days[lang] +
		  "</span>" +
		  "</div>";
	  }

	  var $this = $(this)
		.html(event.strftime(clkHTML))
		.on("finish.countdown", function (event) {
		  $("#clock_wed").remove();
		});
	});

	$("#music_player_BTN").on("click", function () {
	  togglePause();
	});

	var isMobile = false;

	if (
	  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	  )
	) {
	  isMobile = true;
	}

	//IOS Audio Hack

	//var iOS = !!navigator.platform && /iPad|iPhone|iPod|Android/.test(navigator.platform);

	//console.log(iOS);

	if (isMobile && $("#ios_audio_lockscreen").length > 0) {
	  $("#ios_audio_lockscreen").css("display", "block");

	  $(".main_wrapper").addClass("iosAudio");
	}

	var GuestName_fld_val = "";

	$("#ios_audio_lockscreen").on("click", function () {
	  var myAudio_start = document.getElementById("bgmusic");

	  myAudio_start.play();

	  $(this).fadeOut(300);

	  setTimeout(function () {
		$(".main_wrapper").removeClass("iosAudio");

		$(".story_slide.helperSlide").addClass("hlpIndicShow");
	  }, 400);

	  if (evAutoPlay) {
		storySlider.slick("slickPlay");
	  }

	  GuestName_fld_val = $(".guestNames_dyn_wrapper").text();

	  $("form .form-field #full_name").val(GuestName_fld_val);
	});

	SlideBg();
  }); //end ready function

  $(window).on("load", function () {
	$("#preloaderCont").fadeOut();

	$(
	  "form .form-field #full_name, form .form-field #npersons, .form-field select#guests"
	).val("");

	//$('form .form-field #npersons, .form-field select#guests').val('');

	$("form .form-field.fld-npersons").hide();
  });

  $(window).on("resize", function () {
	if ($(window).height() > 768) {
	  appHeight(tplID);

	  SlideBg();
	}
  });

  function togglePause() {
	var myAudio = document.getElementById("bgmusic");

	return myAudio.paused ? myAudio.play() : myAudio.pause();
  }

  function SlideBg() {
	var imgMob, imgDesk;

	$(".story_slide").each(function (index, element) {
	  imgMob = $(this).data("bgmob");

	  imgDesk = $(this).data("bgdesk");

	  if ($(window).width() > 768) {
		$(this).css("background-image", "url(" + imgDesk + ")");
	  } else {
		$(this).css("background-image", "url(" + imgMob + ")");
	  }
	}); //end foreach
  }

  function appHeight(opt) {
	var windowHeight = $(window).height();

	var appframe_height = windowHeight;

	var windowWidth = $(window).width();

	if (opt == 1) {
	  if (window.innerHeight > window.innerWidth) {
		//portrait

		var appframe_height = windowHeight;

		//appframe_height = '100%';

		if (windowHeight > 769 && $(window).width() > 769) {
		  appframe_height = windowHeight * 0.9;

		  var appframe_width = parseInt(appframe_height * 0.57);
		} else {
		  appframe_height = windowHeight;

		  appframe_width = "100%";
		}

		$("#main .main_wrapper").css({
		  //'height':(appframe_height) +'px',

		  height: "100%",

		  width: "100%",
		});
	  } else {
		//if(windowHeight>568){

		appframe_height = windowHeight * 0.9;

		//}

		var widthPROP = parseInt(appframe_height * 0.57);

		$("#main .main_wrapper").css({
		  height: appframe_height + "px",

		  width: widthPROP + "px",
		});
	  }

	  $(".story_slide").css("height", appframe_height + "px");
	} //end opt1

	if (opt == 2) {
	  $("#main .main_wrapper").css({
		height: windowHeight + "px",

		width: "100%",
	  });

	  $(".story_slide").css("height", windowHeight + "px");

	  if (windowHeight > 750 && windowWidth > 768) {
		$("#main").addClass("centerSlideCont");
	  } else {
		$("#main").removeClass("centerSlideCont");
	  }
	} //end opt2
  }

  function RSVP_success_msg(msg) {
	$(".story_slide.rsvp .form-wrapper").addClass("onSuccess");

	$(".ajax_success_message_wrapper").html(msg);
  }

  var Base64 = {
	// private property

	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding

	encode: function (input) {
	  var output = "";

	  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

	  var i = 0;

	  input = Base64._utf8_encode(input);

	  while (i < input.length) {
		chr1 = input.charCodeAt(i++);

		chr2 = input.charCodeAt(i++);

		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;

		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);

		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
		  enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
		  enc4 = 64;
		}

		output =
		  output +
		  this._keyStr.charAt(enc1) +
		  this._keyStr.charAt(enc2) +
		  this._keyStr.charAt(enc3) +
		  this._keyStr.charAt(enc4);
	  } // Whend

	  return output;
	}, // End Function encode

	// public method for decoding

	decode: function (input) {
	  var output = "";

	  var chr1, chr2, chr3;

	  var enc1, enc2, enc3, enc4;

	  var i = 0;

	  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	  while (i < input.length) {
		enc1 = this._keyStr.indexOf(input.charAt(i++));

		enc2 = this._keyStr.indexOf(input.charAt(i++));

		enc3 = this._keyStr.indexOf(input.charAt(i++));

		enc4 = this._keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);

		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);

		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
		  output = output + String.fromCharCode(chr2);
		}

		if (enc4 != 64) {
		  output = output + String.fromCharCode(chr3);
		}
	  } // Whend

	  output = Base64._utf8_decode(output);

	  return output;
	}, // End Function decode

	// private method for UTF-8 encoding

	_utf8_encode: function (string) {
	  var utftext = "";

	  string = string.replace(/\r\n/g, "\n");

	  for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);

		if (c < 128) {
		  utftext += String.fromCharCode(c);
		} else if (c > 127 && c < 2048) {
		  utftext += String.fromCharCode((c >> 6) | 192);

		  utftext += String.fromCharCode((c & 63) | 128);
		} else {
		  utftext += String.fromCharCode((c >> 12) | 224);

		  utftext += String.fromCharCode(((c >> 6) & 63) | 128);

		  utftext += String.fromCharCode((c & 63) | 128);
		}
	  } // Next n

	  return utftext;
	}, // End Function _utf8_encode

	// private method for UTF-8 decoding

	_utf8_decode: function (utftext) {
	  var string = "";

	  var i = 0;

	  var c, c1, c2, c3;

	  c = c1 = c2 = 0;

	  while (i < utftext.length) {
		c = utftext.charCodeAt(i);

		if (c < 128) {
		  string += String.fromCharCode(c);

		  i++;
		} else if (c > 191 && c < 224) {
		  c2 = utftext.charCodeAt(i + 1);

		  string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));

		  i += 2;
		} else {
		  c2 = utftext.charCodeAt(i + 1);

		  c3 = utftext.charCodeAt(i + 2);

		  string += String.fromCharCode(
			((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
		  );

		  i += 3;
		}
	  } // Whend

	  return string;
	}, // End Function _utf8_decode
  };
