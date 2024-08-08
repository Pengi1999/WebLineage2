$(document).ready(function(){
	
	$('.navigation__nav-button').click(function(event){
		$('.navigation__nav-button').toggleClass('active');
		$('.m-nav').toggleClass('active');
		$('.m-nav').scrollTop(0);
		$('.m-nav-bg').toggleClass('active');
	});
	
	$('.m-nav-bg').click(function(event){
		$('.navigation__nav-button').toggleClass('active');
		$('.m-nav').toggleClass('active');
		$('.m-nav').scrollTop(0);
		$('.m-nav-bg').toggleClass('active');
	});
});

