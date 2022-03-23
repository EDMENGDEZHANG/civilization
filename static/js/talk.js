var topicRowClick = function() {
	var dti = $(this).attr('data-topic-id');
	$('.reply-row').each(function() {
		var thisRow=$(this);
		if ($(this).attr('data-reply-for') == dti) {
			var replyHtml='';
			$.ajax({
				async : true,
				url : "/talk/reply",
				type : "GET",
				data : {
					boardId : dti
				},
				success : function(result) {
					
					for(var i=0;i<result.length;i++){
						var reply = result[i];
						replyHtml+='<div style=""><div style="margin-top:20px">'+reply.content+'</div>'+
						'<div style="text-align:right;margin-bottom:20px"><span style="margin-right:20px">—————</span><span style="margin-right:20px">'+reply.userName+'</span><span>'+reply.createTime+'</span></div></div>';
					}
					thisRow.find('.c-reply').html(replyHtml);
				},
				error : function() {
					//console.debug("error found.");
				}
			});
			thisRow.find('.c-topic').slideToggle('fast');
		}else{
			$(this).find('.c-topic').slideUp('fast');
		}
	});
}

$(document).ready(function() {
	// $('#sectionSendTopic').hide();
	var valCurBoard = $('#curBoard').val();
	activetBoard(valCurBoard);

	// refreshPagination(8, 10, 'pageItemTalk');
	$('.boards').click(function(e) {
		e.preventDefault();
		var activeBoard = $(this).data('board');
		activetBoard(activeBoard);
	});

	$('#btnNewTopic').click(function() {
		$.ajax({
			async : false,
			url : "/user/checkLogin",
			type : "POST",
			data : {
			},
			success : function(result) {
				if (result.success) {
					$('#sectionSendTopic').show('slow');
				} else {
					window.location = '/user/login?url='+window.location.href;
				}
			},
			error : function() {
				console.debug("error on list topics");
			}
		});
	});

	$('#btnCancelTopic').click(function() {
		$('#topicTitle').val('');
		$('#topicContent').val('');
		$('#infoTips').html('');
		$('#sectionTips').hide();
		$('#sectionSendTopic').hide('slow');
	});

	$('#btnSendTopic').click(function() {
		var topicTitle = $('#topicTitle').val().trim();
		if (topicTitle == '') {
			$('#titleTips').html('请输入标题');
			$('#titleTips').show();
			return false;
		} else {
			$('#titleTips').hide();
		}

		var topicContent = $.trim($('#topicContent').val());
		if (topicContent == '') {
			$('#contentTips').html('请输入内容');
			$('#contentTips').show();
			return false;
		} else {
			$('#contentTips').hide();
		}
		var curBoard = $('#curBoard').val();
		sendTopic(curBoard, topicTitle, topicContent);
	});

//	$('.topic-row').each(function(){
//		$(this).unbind('click').bind('click',topicRowClick);
//	});
});

var sendTopic = function(curBoard, topicTitle, topicContent) {
	$.ajax({
		async : false,
		url : "/talk/posttopics",
		type : "POST",
		data : {
			boardId : curBoard,
			title : topicTitle,
			content : topicContent
		},
		success : function(result) {
			bootbox.alert("已成功提交给管理员，非常感谢您的宝贵意见，请耐心等待回复。");
			showTopics(result);
			cleanNewTopic();
		},
		error : function() {
			// console.debug("error on send topics");
		}
	});
}

var cleanNewTopic = function() {
	$('#topicTitle').val('');
	$('#topicContent').val('');
	$('#sectionTips').hide();
	$('#sectionSendTopic').hide();
}

var loadTopics = function(curBoard, pageIndex) {
	$.ajax({
		async : false,
		url : "/talk/listtopics",
		type : "POST",
		data : {
			boardId : curBoard,
			pageIndex : pageIndex
		},
		success : function(data) {
			showTopics(data);
		},
		error : function() {
			console.debug("error on list topics");
		}
	});
}

var showTopics = function(data) {
	refreshPagination(data.currentPageNumber, data.totalPage);
	$('#topicList').html('');
	var rows = data.rows;
	if (rows != null) {
		var topicsTrs = '';
		for (i = 0; i < rows.length; i++) {
			topicsTrs = topicsTrs + '<tr class="topic-row" data-topic-id="'
					+ rows[i].id + '">';
			topicsTrs = topicsTrs + '<td>' + rows[i].userName + '</td>';
			topicsTrs = topicsTrs + '<td>' + rows[i].title + '</td>';
			topicsTrs = topicsTrs + '<td class="my-center">'
					+ rows[i].replyCount + '/' + rows[i].viewCount + '</td>';
			topicsTrs = topicsTrs + '</tr>';
			topicsTrs += '<tr class="reply-row" data-reply-for="'
					+ rows[i].id
					+ '" style="padding:0px">'
					+ '<td colspan="3" style="padding:0px;border:0px">'
					+ '<div class="c-topic" style="display:none;background:#444444;color:#FFFFFF;padding:10px;">'
					+ '<div style="font-weight:bold">“'+rows[i].content+'”</div>'
					+'<div class="c-reply"></div>'
					+ '</div></td></tr>';
		}
		$('#topicList').html(topicsTrs);
		$('.topic-row').each(function(){
			$(this).unbind('click').bind('click',topicRowClick);
		});
	}
}

var activetBoard = function(curBoard) {
	$('.boards').each(function() {
		if ($(this).data('board') == curBoard) {
			$(this).parent().addClass('active');
			$('#curBoard').val(curBoard);
			loadTopics(curBoard, 1);
		} else {
			$(this).parent().removeClass('active');
		}
	});
}

var pageNav = function(valPageIndex) {
	var valCurBoard = $('#curBoard').val();
	loadTopics(valCurBoard, valPageIndex);
	// console.debug('customer nav :' + valPageIndex);
}