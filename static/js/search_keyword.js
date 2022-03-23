$(function () {
    //bindSearchKeywords(search_keyword_datas);
    var key = localStorage.search_keyword_data_key;
    $.get("/mfc.php", {"a": "search_cookie_key", "key": key}, function (res) {
        var data = $.parseJSON(res);
        var use_sd_storage = data['data']['use_sd_storage'];
        if (!use_sd_storage) {
            var search_keyword_id = data['data']['search_keyword_id'];
            var search_keyword_data = JSON.parse(data['data']['search_keyword_data']);
            localStorage.setItem('search_keyword_storage', JSON.stringify(search_keyword_data));
            localStorage.setItem('search_keyword_data_key', search_keyword_id);
            search_keyword_datas = search_keyword_data['search_data'];
            search_sections_datas = search_keyword_data['sections'];
        } else {
            data = JSON.parse(localStorage.getItem('search_keyword_storage'));
            search_keyword_datas = data['search_data'];
            search_sections_datas = data['sections'];
        }
        bindSearchKeywords(search_keyword_datas);
    });

    function bindSearchKeywords(data) {
        var searchKeyword = $("#search_input2").val();
        //获得焦点、关键字变化
        $("#search_input2").on("focus paste keyup", function (e) {
            if ($("#search_select").val() == 'left') {
                return;
            }
            if (e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 27) {
                return;
            }
            //匹配关键字
            if (request_path == 'best') {
                var cate = "";
            } else {
                var cate = $(".cur_search_category").val();
            }
            var k = $(this).val();
            var ps = new Array();//关键字匹配数据
            var st = new Array(); //风格匹配数据
            searchKeyword = k;
            if (!k) {
                $("#keywords_popupmenu").addClass("s-menu-hidden");
                $("#keywords_popupmenu_content").html("");
                return;
            }
            var st_len = 0;
            $.each(data, function (val, key) {
                if (val.indexOf(k) != -1) {//匹配成功
                    if (st_len < 15) {
                        st.push(key);
                        st_len++;
                    }
                }
            });

            arr = st;
            arr.sort(function (x, y) {
                return x['keyword'].length - y['keyword'].length;
            });
            var html = "";
            for (i in arr) {
                html += "<div id=\"\" class=\"s-menuitem\">\
		            <div class=\"s-mi-list\" title=\"" + htmlspecialchars(arr[i]['keyword']) + ( arr[i]['code'] ? "（" + arr[i]['code'] + "）" : "" ) + "\" data-cate=\"" + arr[i]['category'] + "\" data-keywords=\"" + htmlspecialchars(arr[i]['keyword']) + "\">\
		                <span class=\"s-mi-cont-key\">" + htmlspecialchars(arr[i]['show_keyword']) + ( arr[i]['code'] ? "（" + arr[i]['code'] + "）" : "" ) + "</span>\
		            </div>\
		        </div>";
            }
            if (!html) {
                html += "<div id=\"\" class=\"s-menuitem\">\
		            <div class=\"s-mi-tip\" data-keywords=\"" + htmlspecialchars(k) + "\">\
		                <i></i>找“<b>" + htmlspecialchars(k) + "</b>”相关<em>商标</em>\
		            </div>\
		        </div>";
            }

            if ($("#keywords_popupmenu").length) {
                $("#keywords_popupmenu_content").html(html);
            } else {
                html = "<div id=\"keywords_popupmenu\" class=\"s-menu-hidden\"><div id=\"keywords_popupmenu_content\">" + html + "</div></div>";
                $("#input1").append(html);
            }
            resetKeywordsPopupmenu();//定位显示下拉
        });

        function htmlspecialchars(str) {
            var s = "";
            if (str.length == 0) return "";
            for (var i = 0; i < str.length; i++) {
                switch (str.substr(i, 1)) {
                    case "<":
                        s += "&lt;";
                        break;
                    case ">":
                        s += "&gt;";
                        break;
                    case "&":
                        s += "&amp;";
                        break;
                    case " ":
                        if (str.substr(i + 1, 1) == " ") {
                            s += " &nbsp;";
                            i++;
                        } else s += " ";
                        break;
                    case "\"":
                        s += "&quot;";
                        break;
                    case "\n":
                        s += "<br>";
                        break;
                    default:
                        s += str.substr(i, 1);
                        break;
                }
            }
            return s;
        }

        //隐藏
        $(document).bind('mousedown', function (event) {
            var $target = $(event.target);
            if ((!($target.parents().andSelf().is('#keywords_popupmenu'))) && (!$target.is("#search_input2"))) {
                $("#keywords_popupmenu").addClass("s-menu-hidden");
            }
        });

        //list hover
        $("body").on("mouseover", ".s-menuitem", function () {
            $(this).addClass("s-menuitem-hover");
        });
        $("body").on("mouseout", ".s-menuitem", function () {
            $(this).removeClass("s-menuitem-hover");
        });
        //点击下拉关键字、风格
        $("body").on("click", ".s-menuitem", function () {
            var obj = $(this).find("div");
            var k = obj.data("keywords");
            var cate = obj.data("cate");
            $("#search_input2").val(k);
            if (cate) {
                $(".cur_search_category").val(cate);
                $(".category_d_s").html("第" + cate + "类")
            }
            $("#search_btn").trigger("click");
            $("#keywords_popupmenu").addClass("s-menu-hidden");
        });

        $('#search_input2').keydown(function (e) {
            if ($("#keywords_popupmenu").length && !$("#keywords_popupmenu").hasClass("s-menu-hidden")) {
                if (e.keyCode == 13) {//回车
                    e.preventDefault();
                    if ($(".s-menuitem-hover").length) {
                        $('#search_input2').val($(".s-menuitem-hover").find("div").data("keywords"));
                        var obj = $(".s-menuitem-hover").find("div");
                        var cate = obj.data("cate");
                        if (cate) {
                            $(".cur_search_category").val(cate);
                            $(".category_d_s").html("第" + cate + "类")
                        }
                    } else {
                        if (search_keyword_datas != undefined) {
                            var obj = $(".s-menuitem").eq(0).find("div");
                            var keyword = $("#search_input2").val();
                            for (i in search_keyword_datas) {
                                if (search_keyword_datas[i]['keyword'] == keyword) {//匹配成功
                                    cate = search_keyword_datas[i]['category'];
                                    $(".cur_search_category").val(cate);
                                    $(".category_d_s").html("第" + cate + "类");
                                    break;
                                }
                            }
                        }
                    }

                    $("#search_btn").trigger("click");
                    $("#keywords_popupmenu").addClass("s-menu-hidden");
                }
                var len = $("#keywords_popupmenu_content .s-menuitem").length;
                var i = $(".s-menuitem-hover").index();
                if (e.keyCode == 38) {//up
                    $("#keywords_popupmenu_content .s-menuitem.s-menuitem-hover").removeClass("s-menuitem-hover");
                    if (i > 0) {
                        $("#keywords_popupmenu_content .s-menuitem:nth-child(" + (i) + ")").addClass("s-menuitem-hover");
                        $('#search_input2').val($("#keywords_popupmenu_content .s-menuitem:nth-child(" + (i) + ")").find("div").data("keywords"));
                    } else if (i == 0) {
                        $('#search_input2').val(searchKeyword);
                    } else {
                        $("#keywords_popupmenu_content .s-menuitem:last-child").addClass("s-menuitem-hover");
                        $('#search_input2').val($("#keywords_popupmenu_content .s-menuitem:last-child").find("div").data("keywords"));
                    }
                    //$('#search_input2').focus();
                }
                if (e.keyCode == 40) {//down
                    $("#keywords_popupmenu_content .s-menuitem.s-menuitem-hover").removeClass("s-menuitem-hover");
                    if (i + 1 == len) {
                        $('#search_input2').val(searchKeyword);
                    } else {
                        $("#keywords_popupmenu_content .s-menuitem:nth-child(" + (i + 2) + ")").addClass("s-menuitem-hover");
                        $('#search_input2').val($("#keywords_popupmenu_content .s-menuitem:nth-child(" + (i + 2) + ")").find("div").data("keywords"));
                    }
                    //$('#search_input2').focus();
                }
                if (e.keyCode == 27) {//esc
                    $('#search_input2').val(searchKeyword);
                    $("#keywords_popupmenu").addClass("s-menu-hidden");
                    //$('#search_input2').focus();
                }
            } else if (e.keyCode == 13) {
                $("#search_btn").trigger("click");
            }

        });

        //显示定位下拉关键字、风格
        function resetKeywordsPopupmenu() {
            //var left = $("#search_input2").offset().left;
//			$("#keywords_popupmenu").css({
//				"left":left
//			}).removeClass("s-menu-hidden");
            $("#keywords_popupmenu").removeClass("s-menu-hidden");
        }

        $(window).resize(function () {
            resetKeywordsPopupmenu();
        })
    }
});