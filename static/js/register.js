$(document)
		.ready(
				function() {
					$('.group-info').hide();
					$('#checkDisplayName').hide();
					$('.check-alert').hide();
					$("#category1").change(function() {
						if (this.checked) {
							$('.group-info').hide();
						}
					});

					$("#category2").change(function() {
						if (this.checked) {
							$('.group-info').show();
						}
					});

					
					var registerForm = $('#registerForm').validate({
						rules : {
							password : {
								required : true
							},
							mobile : {
								required : true,
								digits : true
							},
							displayName : {
								required : true
							},
							realName : {
								required : true
							},
							smsVerifyCode : {
								required : true
							},
							captchaRegister : {
								required : true
							},
							email : {
								required : true,
								email : true
							},
							groupName : {
								required : true
							},
							groupPhone : {
								required : true
							},
							groupAddress : {
								required : true
							},
							groupContact : {
								required : true
							},
							groupContactIDCard:{
								required: true
							},
							agreement:{
								required: true
							}
						},

						// Messages for form validation
						messages : {
							password : {
								required : '请输入密码'
							},
							mobile : {
								required : '请输入手机号码',
								digits : '必须是数字'
							},
							displayName : {
								required : '请输入用户名'
							},
							realName : {
								required : '请输入真实姓名',
							},
							smsVerifyCode : {
								required : '请输入短信验证码'
							},
							captchaRegister : {
								required : '请输入图片验证码'
							},
							email : {
								required : "请输入电子邮箱",
								email : "电子邮箱格式不正确"
							},
							groupName : {
								required : '请输入单位名称'
							},
							groupPhone : {
								required : '请输入单位电话'
							},
							groupAddress : {
								required : '请输入单位地址'
							},
							groupContact : {
								required : '请输入联系人姓名'
							},
							groupContactIDCard : {
								required : '请输入联系人身份证'
							},
							agreement:{
								required: '请同意用户协议'
							}
						},
						// Do not change code below
						 errorPlacement : function(error, element) {
	                            error.insertAfter(element.parent());
                         }
										
					});
					
					$('#email').blur(function() {
						var emailInput = $('#email').val();
						if ($.trim(emailInput) != '') {
							$.ajax({
								async : false,
								url : "/user/registerCheckEmail",
								type : "POST",
								data : {
									email : emailInput
								},
								success : function(result) {
									showCheckEmail(result);
								},
								error : function() {
									//console.debug("error on set user check in");
								}
							});
						}
					}); 
					
					var showCheckEmail = function(result) {
						if (result.success) {
							$('#checkEmail').hide();
						} else {
							$('#checkEmail').html(result.message);
							$('#checkEmail').show();
						}
					};
					
					$('#displayName').blur(function() {
						var displayNameInput = $('#displayName').val();
						if ($.trim(displayNameInput) != '') {
							$.ajax({
								async : false,
								url : "/user/registerCheckUserName",
								type : "POST",
								data : {
									userName : displayNameInput
								},
								success : function(result) {
									showCheckDisplayName(result);
								},
								error : function() {
									//console.debug("error on set user check in");
								}
							});
						}
					});
					
					var showCheckDisplayName = function(result) {
						if (result.success) {
							$('#checkDisplayName').hide();
						} else {
							$('#checkDisplayName').html(result.message);
							$('#checkDisplayName').show();
						}
					};
					
					
					$("#btnCancel").click(function() {
						window.location = "/user/login";
					});

					$('#capResendRegister').click(function(e) {
						e.preventDefault();
						resendCaptcha();
					});

					function resendCaptcha() {
						var cap_img = $('#captchaImgRegister');
						var url = cap_img.attr('src') + '?token='
								+ Math.round(Math.random(0) * 1000);
						cap_img.attr('src', url);
					}

					
					var processSms = function(result){
						if (result.success) {
							$('#checkSendSms').html(result.message);
							$('#checkSendSms').removeClass('error');
							//$('#checkSendSms').hide();
						} else {		
							$('#checkSendSms').addClass('error');
							$('#checkSendSms').html(result.message);
							$('#checkSendSms').show();
						}
					}
		
					$(function() {
						  $("#displayName").on("focus", function() {
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