$(document).ready(function() {
	setPanelImgClass();
	$('.page-holder').click(function(e) {
		e.preventDefault();
		if ($(this).parent().hasClass("disabled")) {
			return false;
		}

		var pageIndex = $(this).data('page-index');
		console.debug('page index: ' + pageIndex);
		window.location = "/highlights/page/" + pageIndex;

	});
});

var setPanelImgClass = function(){
	 $('.post-content').each(function(index) {
        $(this).find('img').addClass('limitImageWidth');
    });	
};