$(function(){

	$('.main').hide();
	$('.hidden').hide();
	var sender = getSession('sender');
    $("#sender").val(sender);
	var message = getSession('draft');
	if(message == '' || message == undefined) message = getSession('message');
    $("#message").val(message);
	unsetSession('draft')
	counta(0);
	getGroup();
});

function getGroup(){	
	$("#grp").html('Contacting Server...<br /><img src="images/loading.gif" />');
	var u = getSession('username');
	var p = getSession('password');
	$.get( api+'username='+escape(u)+'&password='+escape(p)+'&group=true' )
	.fail(function() {
		alert( "Error connecting to server" );
		$("#grp").html('Error connecting to server');
		setFontSize();
	})
	.done(function(data) {
		if(data == '2905' || data == '-2905'){
			alert('Invalid username and password combination.');
			$("#grp").html('Error connecting to server');
			logout();
		} else {
			if(data == '') $("#grp").html('No groups available');
				else {
				var d = data.split('|||');
				var e = '';
				var o = '';
				for(var i = 0; i < d.length; i++){
					e = d[i].split('###');
					o = o +'<a href="#" class="button" onclick="addGroup(\''+e[0]+'\');" >'+e[0]+' ('+e[1]+')</a>';
				}
				$("#grp").html(o);
			}
		}
		setFontSize();
	});
}

function pickDate(){
	var D = $('#YYYY').val()+'-'+$('#MM').val()+'-'+$('#DD').val()+' '+$('#hh').val()+':'+$('#mm').val();
	$('#schedule').val(D);
}
function addGroup(grp){
	var r = $('#recipient').val();
	if(r == '' || r == undefined) r = '';
	else r= r+',';
	$('#recipient').val(r+'::'+grp);
	$('.page').hide();
	$('#main').show();
	countDest();
}

function showGroups(){
	$('.page').hide(300);
	$('.main').show(300);
	$('#groups').show(300);
	$('.groups').hide(300);
}
function showCompose(){
	$('.page').hide(300);
	$('.main').hide(300);
	$('#main').show(300);
	$('.groups').show(300);
	countDest();
}

function counta(val){
	var v = $('#message').val();
	val = v.split("\n").join('??').split('{').join('??').split('}').join('??');
	val = val.split('\\').join('??').split('[').join('??').split(']').join('??');
	val = val.split('~').join('??').split('|').join('??').split('^').join('??');
	val = val.split('�').join('??').split('"').join('??').split("'").join('??');
	len = val.length;
	if(len<=160){
		jQuery('#count').html('Page: '+Math.ceil(len/160)+ ', Characters left: ' + (1+((160 - 1) * Math.ceil(len/160))-len) + ', Total Typed Characters: '+len);
		jQuery('#hiddenCount').html(Math.ceil(len/160)+' page');
	} else {
		jQuery('#count').html('Page: '+Math.ceil(len/151)+ ', Characters left: ' + (1+((150) * Math.ceil(len/151))-len) + ', Total Typed Characters: '+len);	
		jQuery('#hiddenCount').html(Math.ceil(len/151)+' pages');
	}
	countDest();
}
	
	
function countDest(){
	destcount = jQuery("#recipient").val();
	destcount = destcount.split("\n").join(',').split(',,').join(',');
	destcount = trim(destcount,',');
	jQuery("#recipient").val(destcount);
	if(destcount == '') destcount = 0;
	else destcount = destcount.split(',').length;
	if(destcount < 2) jQuery("#destcount").html(destcount+" recipient");
	else jQuery("#destcount").html(destcount+" recipients");
}


 function  confirmSend(){
	var x = jQuery('#hiddenCount').html()+", "+jQuery('#destcount').html()+"\nSend Message?";
	if(confirm(x)){
		var sign = getSession('signature');
		if(sign == null || sign == 'null' || sign == undefined) sign = '';
		var s = $('#sender').val();
		var m = $('#message').val()+sign;
		var r = $('#recipient').val();
		var sch = $('#schedule').val();
		if(s == ''){
			alert('Invalid Sender');
			return;
		}
		if(m == ''){
			alert('Invalid Message');
			return;
		}
		if(r == ''){
			alert('Invalid Destination');
			return;
		}
		
		var u = getSession('username');
		var p = getSession('password');
		var url = api+'username='+escape(u)+'&password='+escape(p)+'&sender='+escape(s)+'&message='+escape(m)+'&recipient='+escape(r)+'&schedule='+escape(sch);
		
		$('.sending').toggle(300);
		$.get( url )
		.fail(function() {
			alert( "Error connecting to server!" );
			$('.sending').toggle(300);
		})
		.done(function(data) {
			var y = data.split(' ');
			y[0] = 'x' + y[0].split('-').join('_');
			var msg = window[y[0]];
			alert( msg );
			$('.sending').toggle(300);
		})
	};
 }

 
 function chooseContacts(){
	window.plugins.PickContact.chooseContact(function (contactInfo) {
		setTimeout(function () { // use timeout to fix iOS alert problem
			if(confirm("Add "+contactInfo.displayName + "?")){
				var nr  = contactInfo.phoneNr;
				var r = $('#recipient').val();
				if(r == '' || r == undefined) r = '';
				else r= r+',';
				nr = nr.split(' ').join('').split(',').join('').split(')').join('').split('(').join('').split('-').join('');
				nr = r+nr;
				$('#recipient').val(nr);
				countDest();
			}
		}, 0);
	});
 }
 
