$(document).ready(function() {
    setPanelImgClass();

    $("#btnGoMobile").click(function(e) {
    	window.location='/highlights/view/10009';
    })

    $("#spinner").spinner('delay', 200) //delay in ms
        .spinner('changed', function(e, newVal, oldVal) {
            //trigger lazed, depend on delay option.
        })
        .spinner('changing', function(e, newVal, oldVal) {
            //trigger immediately
        });

    // 选择场次
    $('#choose .range-item').click(function(e) {
        e.preventDefault();
        var cDiv = $(this);
        var sceneId = cDiv.attr('id');
        $("#choose .range-item").each(function(index, ele) {
            if ($(ele).attr('id') != cDiv.attr('id')) {
                if ($(ele).hasClass('selected')) {
                    $(ele).removeClass('selected');
                }
            }
        });
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $(this).addClass('selected');
        }
        $("#id-reserveCon-detail-info .scene-info").each(function(index, ele) {
            if ($(ele).attr('data-scene') != cDiv.attr('id')) {
                if (!$(ele).hasClass('hidden')) {
                    $(ele).addClass("hidden");
                }
            } else {
                if ($(ele).hasClass('hidden')) {
                    $(ele).removeClass('hidden');
                }
            }
        });
        showJoinList(sceneId);
    });

    // 点击预约
    $(".book-btn").click(function() {
        var bookIds = [];
        $('#choose .range-item').each(function(index, ele) {
            if ($(ele).hasClass('selected')) {
                bookIds[bookIds.length] = $(ele).attr("id");
            }
        });
        if (bookIds.length == 0) {
            bootbox.alert('请选择场次');
        } else {
        	var quantityObj  = $('#quantitySelected' + bookIds[0]);

            var span = $('#' + bookIds[0] + ' span:first');
            var buttonName = $(this).attr(
                'value');
            var info = "";
            if (buttonName == '我感兴趣') {
                info = "<b>确定["+quantityObj.val()
                +"]份对以下场次感兴趣</b>?<br/><br/>" + span.html()
                ;
            } else if (buttonName == '立即预约') {
                info = "<b>确定预约以下场次共["+quantityObj.val()
                +"]份</b>?<br/><br/>"+ span.html();
            } else if (buttonName == '参与摇号') {
                info = "<b>确定参与以下场次的摇号共["+quantityObj.val()
                +"]份</b>?<br/><br/>"+span.html();
            } else if (buttonName == '加入排队') {
                info = "<b>确定加入以下场次的排队共["+quantityObj.val()
                +"]份</b>?<br/><br/>"+ span.html();
            } else if (buttonName == '团体预约') {
                info = "<b>确定团体预约以下场次共["+quantityObj.val()
                +"]份</b>?<br/><br/>"+ span.html();
            } else {
                return false;
            }
            bootbox.confirm(info, function(choosen) {
                if (choosen) {
                    $('#chooseForm').attr('action', '/apply/' + bookIds[0]);
                    $('#chooseForm').submit();
                }
            });
        }
    });

    $('#id-mark-star').click(function(event) {
        markOperation(event, $(this));
    });

    $('#id-mark-star').mousemove(function(event) {
        markOperation(event, $(this));
    });

    function markOperation(event, markObject) {
        // 获得对象相对于页面的横坐标值；id为对象的id
        var thisX = markObject.offset().left;
        // 获得对象相对于页面的横坐标值；
        var thisY = markObject.offset().top;
        // 获得页面滚动的距离；
        // 注：document.documentElement.scrollTop为支持非谷歌内核；document.body.scrollTop为谷歌内核
        var thisScrollTop = document.documentElement.scrollTop + document.body.scrollTop;
        event = event || window.event;
        // 获得相对于对象定位的横标值 = 鼠标当前相对页面的横坐标值 - 对象横坐标值；
        var x = event.clientX - thisX;
        // 获得相对于对象定位的纵标值 = 鼠标当前相对页面的纵坐标值 - 对象纵坐标值 + 滚动条滚动的高度；
        var y = event.clientY - thisY + thisScrollTop;
        var mark = Math.floor(x / 18 + 1);
        // $('#id-text-comment').val(mark);
        markObject.removeClass(markObject.attr('data-name'));
        var switchToClass = "mid-str" + mark * 10;
        markObject.addClass(switchToClass);
        markObject.attr('data-name', switchToClass);
        $('#mark-score').attr('value', mark);
    }

    $('#id-text-comment').focus(function() {
        if ($('#id-div-sbm-cmt').hasClass('hide')) {
            $('#id-div-sbm-cmt').removeClass('hide')
        }
    });

    $('#id-text-comment').blur(function() {
        if ($('#id-text-comment').val().trim() == '') {
            if (!$('#id-div-sbm-cmt').hasClass('hide')) {
                $('#id-div-sbm-cmt').addClass('hide')
            }
        }
    });
    // 评论文本区域
    $('#id-text-comment').keyup(function() {
        var len = $(this).val().length;
        if (len < 1) {
            // $('#word-counter-div').html("写15个字才是好同志。还需<span>"+(15-len)+"</span>个字");
            $('#word-counter-div').html(
                "请至少写一个字，评论写得好，可以加分哦。");
        } else {
            // detail.jsp页面的id="id-text-comment"的textarea框，设置的maxlength="1000"
            $('#word-counter-div').html(
                "您还可以输入<span>" + (1000 - len) + "</span>个字");
        }
    });
    $('#id-sbm-comment').click(function() {
        var comment = $('#id-text-comment');
        if (comment.val().length < 1) {
            return false;
        }
    });

    // 分享到
    $('a.bn-sharing').click(function(e) {
        e.preventDefault();
        var displayValue = $('#db-div-sharing').css('display');
        if (displayValue == 'none') {
            $('#db-div-sharing').css('display', 'block');
            var source = $(this);
            var thisLeft = source.offset().left;
            var thisTop = source.offset().top;
            var thisHeight = source.height();
            $('#db-div-sharing').offset(function() {
                var newPos = new Object();
                newPos.left = thisLeft;
                newPos.top = thisTop + thisHeight;
                return newPos;
            });
        } else {
            $('#db-div-sharing').css('display', 'none');
        }
    });

    $('a.bn-sharing').blur(function() {
        setTimeout(function() {
            $('#db-div-sharing').css('display', 'none');
        }, 200);
    });

    // 分享到新浪微博
    $('.share-2-sin').click(function(e) {
        e.preventDefault();
        var data = $('#share-2-data');
        $('#db-div-sharing').css('display',
            'none');
        var weibo = 'http://v.t.sina.com.cn/share/share.php?title=[文化有约]' + data.attr('data-title') + '&url=' + data.attr('data-url') + '&pic=' + data.attr('data-pic');
        var win = window.open(weibo, '分享到新浪微博',
            'width=440,height=430');
        win.focus();
    });
    // 分享给QQ好友
    $('.share-2-qqim').click(function(e) {
        e.preventDefault();
        $('#db-div-sharing').css('display',
            'none');
        var data = $('#share-2-data');
        var qq = 'http://connect.qq.com/widget/shareqq/index.html?url=' + data.attr('data-url') + '&desc=' + data.attr('data-title') + '&pics=' + data.attr('data-pic') + '&site=文化有约}';
        var win = window.open(qq, '分享给QQ好友');
        win.focus();
    });

    // 分享到QQ空间
    $('.share-2-qzone').click(function(e) {
        e.preventDefault();
        $('#db-div-sharing').css('display',
            'none');
        var data = $('#share-2-data');
        var qq = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + data.attr('data-url');
        var win = window.open(qq, '分享到QQ空间');
        win.focus();
    });

    // 分享到腾讯微博
    $('.share-2-tx').click(function(e) {
        e.preventDefault();
        $('#db-div-sharing').css('display',
            'none');
        var data = $('#share-2-data');
        var qq = 'http://v.t.qq.com/share/share.php?title=[文化有约]' + data.attr('data-title') + '&url=' + data.attr('data-url') + '&site=文化有约';
        var win = window.open(qq, '分享到腾讯微博',
            'width=440,height=430');
        win.focus();
    });

    // 分享到微信
    $('.share-2-wx').click(function(e) {
        e.preventDefault();
        $('#db-div-sharing').css('display', 'none');
        var displayValue = $('#dui-dialog').css('display');
        if (displayValue == 'none') {
            $('#dui-dialog').css('display', 'block');
        } else {
            $('#dui-dialog').css('display', 'none');
        }
    });

    $('.dui-dialog-close').click(function(e) {
        e.preventDefault();
        $('#dui-dialog').css('display', 'none');
    });


});
// 显示入围名单
var showJoinList = function(sceneId) {
    $('.tabJoinList').removeClass('active');
    $('#tabJoinList-' + sceneId).addClass('active');
    $('.dataJoinList').removeClass('active');
    $('#dataJoinList-' + sceneId).addClass('active');
};
// 调整富文本框中图片宽度
var setPanelImgClass = function() {
    $('.tab-pane').each(function(index) {
        $(this).find('img').addClass('limitImageWidth');
    });
};