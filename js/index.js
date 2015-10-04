$(function (){
	$.get( api+'regMobile=check' )
	.done(function(data) {
		if(data == 'Enabled') $('.register').show(300);
	});
});

function login(){
	$('.login').toggle();
	var username = $('#username').val();
	var password = $('#password').val();
	if(username == '') {
		alert('Username is required');
		$('.login').toggle();
		return;
	}
	if(password == '') {
		alert('Password is required');
		$('.login').toggle();
		return;
	}
	$.get( api+'username='+escape(username)+'&password='+escape(password)+'&balance=true' )
	.fail(function() {
		alert( "Error connecting to server" );
	  })
	  .done(function(data) {
		if(data == '2905' || data == '-2905'){
			alert('Invalid username and password combination.');
			logout();
		} else {
			setSession('username',username);
			setSession('password',password);
			$('.login').toggle();
			window.location = 'menu.html';
		}
	  });
}

if(isLoggedIn() == true){
	window.location = 'menu.html';
}
