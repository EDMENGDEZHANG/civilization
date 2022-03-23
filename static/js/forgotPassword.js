$(document).ready(function() {
	$("#capResend").click(function(e) {
		e.preventDefault();
		
		var capImag = $("#captchaImg");
		var capUrl = capImag.attr('src') + '?token='
				+ Math.round(Math.random(0) * 1000);
		capImag.attr('src', capUrl);
	});
	
	var forgotPasswordForm = $('#forgotPasswordForm').validate({
		// Rules for form validation
		rules : {
			captcha : {
				required : true
			},
			email : {
				required : true,
				email : true
			}
		},

		// Messages for form validation
		messages : {
			captcha : {
				required : '请输入图片验证码'
			},
			email : {
				required : "请输入电子邮箱",
				email : "电子邮箱格式不正确"
			}
		},
		// Do not change code below
		errorPlacement : function(error, element) {
			error.insertAfter(element);
		}
	});

	$("#btnCancel").click(function() {
		window.location = "/user/login";
	});

});