var $chrt_border_color = "#efefef";
var $chrt_grid_color = "#DDD"
var $chrt_main = "#E24913";
/* red       */
var $chrt_second = "#6595b4";
/* blue      */
var $chrt_third = "#FF9F01";
/* orange    */
var $chrt_fourth = "#7e9d3a";
/* green     */
var $chrt_fifth = "#BD362F";
/* dark red  */
var $chrt_mono = "#000";

$(document).ready(function() {
	function convertToArray2(jsonArray) {
		var d = new Array();
		$.each(jsonArray, function(index, value) {
			var item = Object.keys(value);
			var k = moment(item[0], "YYYY-MM-DD")
				.toDate().getTime();
			var v = value[item];
			d.push([k, v]);
		});
		return d;
	}

	var statsFunc = function() {
		var options = {
			xaxis: {
				mode: "time",
				timeformat: "%Y/%m/%d"
			},
			series: {
				lines: {
					show: true,
					lineWidth: 1,
					fill: false,
					fillColor: {
						colors: [{
							opacity: 0.1
						}, {
							opacity: 0.15
						}]
					}
				},
				points: {
					show: true
				},
				shadowSize: 0
			},
			selection: {
				mode: "x"
			},
			grid: {
				hoverable: true,
				clickable: true,
				tickColor: $chrt_border_color,
				borderWidth: 0,
				borderColor: $chrt_border_color,
			},
			tooltip: true,
			tooltipOpts: {
				content: "<b>%x</b>%s为<span>%y</span>",
				dateFormat: "%y年%m月%d日",
				defaultTheme: false
			},
			colors: [$chrt_main, $chrt_second,
				$chrt_third
			],

		};
		$.ajax({
			async: true,
			url: "/stat/siteVisit",
			type: "POST",
			data: {
				yearMonth: $('#yearMonth')
					.val()
			},
			success: function(result) {
				var parsed = JSON.parse(result);
				var siteStatData = convertToArray2(parsed.statReport);
				var plot1 = $.plot($("#site-stats"), [{
							data: siteStatData,
							label: '访问量'
						}], options);
			},
			error: function() {
			}
		});
	};

	//站点统计chart
	statsFunc();
	//点击查看按钮
	$('#btnSearch').click(function() {
		statsFunc();
	});

});
/* end site stats */