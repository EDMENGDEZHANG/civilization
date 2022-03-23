
if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}
}

// loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
// loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as
// a JavaScript file
// loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css
// file
function loadjscssfile(filename, filetype) {
	if (filetype == "js") { // if filename is a external JavaScript file
		var fileref = document.createElement('script')
		fileref.setAttribute("type", "text/javascript")
		fileref.setAttribute("src", filename)
	} else if (filetype == "css") { // if filename is an external CSS file
		var fileref = document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref != "undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}

/**
 * fix IE<9 Ojbect.keys not support issue.
 */
if (!Object.keys) {
	Object.keys = (function() {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !({
			toString : null
		}).propertyIsEnumerable('toString'), dontEnums = [ 'toString',
				'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf',
				'propertyIsEnumerable', 'constructor' ], dontEnumsLength = dontEnums.length;

		return function(obj) {
			if (typeof obj !== 'object'
					&& (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}

var changeLocation = function(locationId) {
	var url = "/user/changeLocation/" + locationId;
	window.location = url;
}
var navPlaceUrl = function(placeId) {
	var url = "/highlights/place/" + placeId;
	window.location = url;
}
var navProjectUrl = function(placeId) {
	var url = "/detail/" + placeId;
	window.location = url;
}

var isNumber = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// 实现字符串格式化
// Example: "{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")
// Output: ASP is dead, but ASP.NET is alive! ASP {2}
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}

// bootbox 设置
$(document).ready(function() {
	try {
		bootbox.setDefaults({
			locale : "zh_CN",
			show : true,
			backdrop : true,
			closeButton : true,
			animate : true,
			className : "my-modal"
		});
	} catch (err) {
	}
});

// 验证码
$(document).ready(
		function() {
			var loginUserForm = $('#loginUserForm').validate({
				// Rules for form validation
				rules : {
					captcha : {
						required : true
					},
					password : {
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

			$("#capResend").click(
					function(e) {
						e.preventDefault();
						var capImag = $("#captchaImg");
						var capUrl = capImag.attr('src') + '?token='
								+ Math.round(Math.random(0) * 1000);
						capImag.attr('src', capUrl);
					});
		});

// 分页JS
$('#pagination_previous a').click(function(event) {
	if ($('#pagination_previous').hasClass('disabled')) {
		return false;
	}
	event.preventDefault();
	var pageIndex = parseInt($('#curPage').val()) - 1;
	clickPageItem(pageIndex);
});

$('#pagination_next a').click(function(event) {
	if ($('#pagination_next').hasClass('disabled')) {
		return false;
	}
	event.preventDefault();
	var pageIndex = parseInt($('#curPage').val()) + 1;
	clickPageItem(pageIndex);
});

var clickPageItem = function(pageIndex) {

	$(".pageItem").each(function(index, value) {
		var loopPageIndex = parseInt($(this).data('page-index'));
		if (pageIndex == loopPageIndex) {
			// console.debug('triger event');
			$(this).click();
		}
	});
}

var refreshPagination = function(pageIndex, pageCount) {
	$('#totalPages').val(pageCount);
	$('#curPage').val(pageIndex);
	if (pageCount < 2) {
		$('#sectionPagination').hide();
		return false;
	} else {
		$('#sectionPagination').show();
	}
	if (pageIndex == 1) {
		$('#pagination_previous').addClass('disabled');
		$('#pagination_previous').removeClass('active');
	} else {
		$('#pagination_previous').removeClass('disabled');
		$('#pagination_previous').addClass('active');
	}
	if (pageIndex == pageCount) {
		$('#pagination_next').addClass('disabled');
		$('#pagination_next').removeClass('active');
	} else {
		$('#pagination_next').removeClass('disabled');
		$('#pagination_next').addClass('active');
	}
	buildPaginationList(pageIndex, pageCount);
}

var buildPaginationList = function(pageIndex, pageCount) {
	$('#pagination_list').html('');
	var buildHtml = '';
	if ((pageIndex > 0) && (pageIndex <= pageCount)) {
		var startIndex = 1;
		if ((pageIndex - 3) > 0) {
			startIndex = pageIndex - 3;
		}
		var endIndex = pageIndex + 4;
		if ((pageIndex + 4) > pageCount) {
			endIndex = pageCount;
		}
		// console.debug('startIndex: ' + startIndex);
		// console.debug('endIndex: ' + endIndex);
		for (i = startIndex; i <= endIndex; i++) {
			var liHtml = '<li><a class="pageItem" data-page-index="' + i + '">'
					+ i + '</a></li>';
			if (i == pageIndex) {
				liHtml = '<li class="active"><a class="pageItem" data-page-index="'
						+ i + '">' + i + '</a></li>';
			}
			buildHtml = buildHtml + liHtml;
		}
	}
	$('#pagination_list').html(buildHtml);

	$('.pageItem').unbind('click').bind('click', function() {
		var valPageIndex = $(this).data('page-index');
		var valPageTotal = $('#totalPages').val();
		refreshPagination(valPageIndex, valPageTotal);
		try {
			// 自定义函数，每个需要分页的页面自己实现
			pageNav(valPageIndex);

			// console.debug('customer index: '+valPageIndex);
		} catch (err) {
		}
	});
}

/***
 * 腾讯地图异步加载
 */
var loadScript = function() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://map.qq.com/api/js?v=2.exp&key=6LLBZ-QMLCX-HNA4L-T3ADN-4O3V5-BFFLB&callback=initMap";
	document.body.appendChild(script);
};
var initMap = function() {
	var centerPos = new qq.maps.LatLng(30.75964, 120.74379);
	var placePosition = document.getElementById('placePosition');
	if (placePosition.value && placePosition.value.length > 10) {
		var latlngs = placePosition.value.split(",");
		if (latlngs.length > 1 && latlngs[0] < 70) {
			centerPos = new qq.maps.LatLng(latlngs[0], latlngs[1]);
		}
	}
	var myOptions = {
			zoom : 16,
			center : centerPos,
			mapTypeId : qq.maps.MapTypeId.ROADMAP
		}
	var map = new qq.maps.Map(document.getElementById("container"), myOptions);
	
	marker = new qq.maps.Marker({
		position : map.getCenter(),
		draggable : false,
		map : map
	});
	// 信息窗口(此处用来显示场馆名称)
	var infoWin = new qq.maps.InfoWindow({
		map : map
	});
	infoWin.open();
	infoWin.setContent(document.getElementById('placeName').value);
	infoWin.setPosition(map.getCenter());
};
