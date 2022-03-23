// 通用url，部署改成第一个
var baseUrl = "http://120.79.145.227:8000"//请求地址
let user = getUser() //获取user
//把全局的关于user方法拿出来
function setUser(obj) {
	window.localStorage['user'] = JSON.stringify(obj);
}

function getUser() {
	var obj = window.localStorage['user'];
	if (obj) {
		return JSON.parse(obj);
	} else {
		return null
	}
}
//判断全局user字段的时候进行判断
if (user) {
	$('#li-welcome>a').html(`您好,${user.name}`)
	$("#li-register").hide()
	$("#li-login").hide()
} else {
	$('#reservation').attr('href', 'javascript:;')
	$('#scoreinfo').attr('href', 'javascript:;')
	$('#info').attr('href', 'javascript:;')
	$("#reservation").click(function() {
		$('.layui-layer-content>.title>.t1').html('会员登录')
		$('#layui-layer1').show()
	})
	$("#scoreinfo").click(function() {
		$('.layui-layer-content>.title>.t1').html('会员登录')
		$('#layui-layer1').show()
	})
	$("#info").click(function() {
		$('.layui-layer-content>.title>.t1').html('会员登录')
		$('#layui-layer1').show()
	})
	$('#li-welcome>a').hide()
	$("#li-register").show()
	$("#li-login").show()
	$('#li-logout').hide()
}
//判断是否是pc端，如果不是pc端的话，跳转到手机端
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"
	];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
//判断是否是支付宝
let ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/Alipay/i) == "alipay") {
	window.location.pathname = "/zfb"
}
//判断在把活动详情中把链接中的url分享到移动端时，直接跳转到移动端的这个活动详情id
if (!IsPC()) {
	let search = ''
	search = window.location.search
	if (search) {
		search = search.split('=')
		if (search[1]) {
			window.location.href = window.location.protocol + "//" + window.location.hostname + "/h5/#/detail/" + search[1]
			window.sessionStorage.setItem('type', 1)
		}
	} else {
		window.location.pathname = "/h5"
		window.sessionStorage.setItem('type', 0)
	}
}
