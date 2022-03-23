$(document).ready(function() {
	$("#capResend").click(function(e) {
		e.preventDefault();
		var capImag = $("#captchaImg");
		var capUrl = capImag.attr('src') + '?token='
				+ Math.round(Math.random(0) * 1000);
		capImag.attr('src', capUrl);
	});
	
	var loginUserForm = $('#loginUserForm').validate({
		// Rules for form validation
		rules : {
			mobile : {
				required : true,
				digits : true
			},
			smsVerifyCode : {
				required : true
			},
			displayName : {
				required : true
			}
		},

		// Messages for form validation
		messages : {
			captcha : {
				required : '请输入图片验证码'
			},
			password : {
				required : '请输入密码'
			},
			displayName : {
				required : "请输入登录名"
			}
		},
		// Do not change code below
		errorPlacement : function(error, element) {
			error.insertAfter(element.parent());
		}
	});
	
	$(function() {
		  $("[autofocus]").on("focus", function() {
		    if (this.setSelectionRange) {
		      var len = this.value.length * 2;
		      this.setSelectionRange(len, len);
		    } else {
		      this.value = this.value;
		    }
		    this.scrollTop = 999999;
		  }).focus();
		});
});