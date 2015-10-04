api = 'http://estoresms.com/index.php?option=com_spc&comm=spc_api&mobi=true&';
domain = 'estoresms.com';
appname = 'EstoreSMS';
xOK = 'Operation completed successfully.';
x_2904 = 'SMS Sending Failed';
x_2905 = 'Username/Pasword combination is incorrect';
x_2906 = 'Credit Exhausted';
x_2907 = 'Gateway Unavailable';
x_2908 = 'Invalid Schedule Date';
x_2909 = 'Scheduling failed.';
x_2910 = 'Invalid Username';
x_2911 = 'Invalid Password';
x_2912 = 'Invalid recipient';
x_2913 = 'Invalid Message';
x_2914 = 'Invalid Sender ID';
x_2915 = 'One or more required fields are missing';
x_101 = 'Invalid voucher';
x_102 = 'Used voucher';
x_103 = 'Unable to load voucher';
x_106 = 'Invalid group name.';
x_107 = 'Operation failed.';


$(function (){
	$('.appname').html(appname);
	$('.domain').html(domain);
	$('.footer').html('&copy; '+domain+'. All rights reserved.');
	
    setFontSize();
});


function setSession(key,value){
    window.localStorage.setItem(key, value);
}

function getSession(key){
    return window.localStorage.getItem(key);
}

function unsetSession(key){
    window.localStorage.removeItem(key);
}

function clearSession(){
    window.localStorage.clear();
}
function setFontSize(){
    var fs = getSession('fontsize');
    if(fs == '' || !is_numeric(fs) || fs < 10){
		fs = 16;
		setSession('fontsize',fs);
	}
    $("html, body, .page, a, textarea, select").css("font-size", fs+"px");
    $("h1").css("font-size", Math.floor(fs*1.4)+"px");
    $("h2").css("font-size", Math.floor(fs*1.3)+"px");
    $("h3").css("font-size", Math.floor(fs*1.2)+"px");
    $("h4").css("font-size", Math.floor(fs*1.1)+"px");
    $("input").css("font-size", fs+"px");
    
}
function is_numeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isLoggedIn(){
	var u = getSession('username');
	var p = getSession('password');
	if(u != '' && u != undefined && p != '' && p != undefined){
		return true;
	} else {
		return false;
	}
}

function nothing(){};

function balance(){
	var u = getSession('username');
	var p = getSession('password');
	if(u != '' || u != undefined || p != '' || p != undefined){
	} else {
		logout();
	}
	
	$.get( api+'username='+escape(u)+'&password='+escape(p)+'&balance=true' )
	.fail(function() {
		alert( "Error connecting to server" );
	  })
	  .done(function(data) {
		if(data == '2905' || data == '-2905'){
			alert('Invalid username and password combination.');
			logout();
		} else {
			$(".balance").html(number_format(0+data,2));
		}
	  });
}

function logout(){
	unsetSession('username');
	unsetSession('password');
	window.location = "index.html";
}