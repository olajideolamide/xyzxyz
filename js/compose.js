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
	//getGroup();
});

function getGroup(){	
	$("#grp").html('Fetching Groups...<br /><img src="images/loading.gif" />');
	var u = getSession('email');
	var p = getSession('password');

	$.ajax({
			type: 'GET',

		  	dataType:'jsonp',

		  	cache: 'true',

			url: api+'?pd_m=groups&email='+escape(u)+'&password='+escape(p)+'&callback=?',
			
			
		 	jsonpCallback: 'jsonCallback',
		    contentType: "application/json",
		    dataType: 'jsonp',
		    success: function(json) {
		      	if(json.response[0].code == '001')
		      	{
					alert('Invalid username and password combination.');
					$("#grp").html('Could not fetch groups');
					logout();
				}
				else if(json.response[0].code == '004')
				{
					$("#grp").html('No groups available');
				} 
				else 
				{
					var data = json.response[0].payload;
					
					var d = data.split('|||');
					var e = '';
					var o = '';
					for(var i = 0; i < d.length; i++)
					{
						e = d[i].split('###');
						o = o +'<a href="#" class="button" onclick="addGroup(\''+e[0]+'\',\''+e[1]+'\');" >'+e[0]+' (ID: '+e[1]+')</a>';
					}
					$("#grp").html(o);
					
				}
				setFontSize();
		    },
		    error: function(e) {
		       //alert('Unable to connect to server. Please check your network connection');
		       alert('No internet connection');
		       
		       //$('.sending').toggle(300);
		    }
		});
}

function pickDate(){
	var D = $('#YYYY').val()+'-'+$('#MM').val()+'-'+$('#DD').val()+' '+$('#hh').val()+':'+$('#mm').val();
	$('#schedule').val(D);
}
function addGroup(grp, id){
	var r = $('#recipient').val();
	if(r == '' || r == undefined) r = '';
	else r= r+',';
	$('#recipient').val(r+'<'+id+'>'+grp);
	$('.page').hide();
	$('#main').show();
	countDest();
}

function showGroups(){
	$('.page').hide(300);
	$('.main').show(300);
	getGroup();
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
	val = val.split('€').join('??').split('"').join('??').split("'").join('??');
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
		if(sch != '')
			sch = sch+':00';
		
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
		
		var u = getSession('email');
		var p = getSession('password');
		var url = api+'?pd_m=send&email='+escape(u)+'&password='+escape(p)+'&senderID='+escape(s)+'&textmessage='+escape(m)+'&to_number='+escape(r)+'&dateTime='+escape(sch)+'&callback=?';
		
		
		$('.sending').toggle(300);
		/*$.get( url )
		.fail(function() {
			//alert( "Error connecting to server!" );
			$('.sending').toggle(300);
		})
		.done(function(data) {
			var y = data.split(' ');
			y[0] = 'x' + y[0].split('-').join('_');
			var msg = window[y[0]];
			alert( msg );
			$('.sending').toggle(300);
		})*/

		$.ajax({
			type: 'GET',

		  	dataType:'jsonp',

			url: url,

		 	jsonpCallback: 'jsonCallback',
		    contentType: "application/json",
		    dataType: 'jsonp',
		    success: function(json) {
		       if(json.response[0].code == '000')
		       {
				   alert(json.response[0].description+': SMS cost is '+json.response[0].payload);
				   
					$('.sending').toggle(300);
				}
				else
				{
					
					alert(json.response[0].description+': '+json.response[0].payload);

					$('.sending').toggle(300);
				}
		    },
		    error: function(e) {
		       alert('Unable to connect to server. Please check your network connection');
		       $('.sending').toggle(300);
		    }
		});
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
 
