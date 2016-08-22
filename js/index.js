/*$(function (){
	$.get( api+'regMobile=check&callback=?' )
	.done(function(data) {
		if(data == 'Enabled') $('.register').show(300);
	});
});*/

function login(){
	$('.login').toggle();
	var email = $('#email').val();
	var password = $('#password').val();
	if(email == '') {
		alert('Email is required');
		$('.login').toggle();
		return;
	}
	if(password == '') {
		alert('Password is required');
		$('.login').toggle();
		return;
	}
	/*$.get( api+'username='+escape(username)+'&password='+escape(password)+'&balance=true' )
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
	  });*/


		$.ajax({
			type: 'GET',

		  	dataType:'jsonp',

			url: api+'?pd_m=login&email='+escape(email)+'&password='+escape(password)+'&callback=?',

		 	jsonpCallback: 'jsonCallback',
		    contentType: "application/json",
		    dataType: 'jsonp',
		    success: function(json) {
		       if(json.response[0].code == '000')
		       {
					setSession('email',email);
					setSession('password',password);
					$('.login').toggle();
					window.location = 'menu.html';
				}
				else
					alert('Sorry, we could not log you in.');
		    },
		    error: function(e) {
		       alert('Sorry, we could not log you in.');
		    }
		});


}

if(isLoggedIn() == true){
	window.location = 'menu.html';
}
