/**
 * activityList.jsp 活动列表界面的js文件
 */
$(document).ready(function() {
	
	
	$('#queryForm').submit(function(e){
		$('#search-btn').trigger('click');
		return false;
	})
	$('#project-list-div').on("click",".param-holder",function(e){
		e.preventDefault();
		if($(this).parent().hasClass("disabled")){
			return false;
		}
		$("[data-filter='"+$(this).attr("data-filter")+"']").each(function(index,ele){
			if($(ele).hasClass("param-selected")){
				$(ele).removeClass("param-selected");
			}
		});
		if (!$(this).hasClass("param-selected")) {
			$(this).addClass("param-selected");
		}

		var param = "Q";
		$('#project-list-div .param-selected').each(function(index, ele) {
			if($(ele).attr("id")!='undefined'&&$(ele).attr("id")!=null){
				param=param+"-"+$(ele).attr("id");
			}
		});
		var word = $('#search-word-box').val();
		var escWord=encodeURI(encodeURI(word));
		// window.location.assign("/"+$('#filter').val()+"/"+param+"?k="+escWord);
	});
	
	if($('#L-param').val()=='L9999'||$('#L-param').val().trim()=='L'){
		$('#L9999').addClass("param-selected");
	}else{
		$('#ul-location a').each(function(index,ele){
			if($('#L-param').val()==$(ele).attr("id")){
				$(ele).addClass("param-selected");
			}
		});
	}
	if($('#P-param').val()=='P9999'||$('#P-param').val().trim()=='P'){
		$('#P9999').addClass("param-selected");
	}else{
		$('#ul-place a').each(function(index,ele){
			if($('#P-param').val()==$(ele).attr("id")){
				$(ele).addClass("param-selected");
			}
		});
	}
	if($('#A-param').val()=='A9999'||$('#A-param').val().trim()=='A'){
		$('#A9999').addClass("param-selected");
	}else{
		$('#ul-activity a').each(function(index,ele){
			if($('#A-param').val()==$(ele).attr("id")){
				$(ele).addClass("param-selected");
			}
		});
	}
	if($('#R-param').val()=='R9999'||$('#R-param').val().trim()=='R'){
		$('#R9999').addClass("param-selected");
	}else{
		$('#ul-reservation a').each(function(index,ele){
			if($('#R-param').val()==$(ele).attr("id")){
				$(ele).addClass("param-selected");
			}
		});
	}
});