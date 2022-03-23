
jQuery(document).ready(function(e) { 
	jQuery(".is-carousel").each(function(){
		var carousel_id = jQuery(this).attr('id');
	
		var carousel_auto = jQuery(this).data('notauto')?false:true;
		var carousel_auto_timeout = jQuery(this).data('auto_timeout')?jQuery(this).data('auto_timeout'):3000;
		var carousel_auto_duration = jQuery(this).data('auto_duration')?jQuery(this).data('auto_duration'):800;
	
		topcarousel = jQuery(this).find(".carousel-content");
		if(topcarousel.length){
			if(carousel_id=='big-carousel'){
				visible = 3;
				align = "center";
				start = -1;
			}else{
				visible = 0;
				align = false;
				start = 0;
			}
			tcarousel = topcarousel.carouFredSel({
				responsive  : false,
				items       : {
					visible	: function(visibleItems){
						if(visible>0){
							if(visibleItems>=3){
								return 5;
							}else{
								return 3;
							}
						}else{return visibleItems+1;}
					},
					minimum	: 1,
					start : start,
				},
				circular: true,
				infinite: true,
				width 	: "100%",
				auto 	: {
					play	: carousel_auto,
					timeoutDuration : carousel_auto_timeout,
					duration        : carousel_auto_duration,
					pauseOnHover: "immediate-resume"
				},
				align	: align,
				prev	: {	
					button	: "#"+carousel_id+" .prev",
					key		: "left"
				},
				next	: { 
					button	: "#"+carousel_id+" .next",
					key		: "right"
				},
				scroll : {
					items : 1,
					duration : carousel_auto_duration,
					fx : "scroll",
					easing : 'quadratic',

				},
			
			})
		
	}
		
	});
	


});

