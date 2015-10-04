(function( $ ) { 
    $.fn.accordionz = function(speed) {
		if(typeof(speed)==='undefined') speed = 300;
		return this.each(function() {
			$(this).children("div").hide();
			$(this).children("h1, h2, h3, h4, h5, h6").each(function(){
				$(this).click(function (){
					var showing = $(this).next("div").is(":visible")
					$(this).parent().children("div").hide(speed);
					if(!showing) $(this).next("div").show(speed);
					return false;
				})
			});
		}); 
	};
}( jQuery ));