function backup(){
	if(!confirm('Backup your entire contacts to '+domain+'?')) return;
	var grp = $('#group').val();
	if(grp == '' || grp == undefined) {
		alert('Invalid group name');
		return;
	}
	$(".sending").toggle(300);
	var options = new ContactFindOptions();
	options.filter = "";
	options.multiple = true;
	var filter = ["displayName", , "phoneNumbers"];
	navigator.contacts.find(filter, onSuccess, onError, options);
}


function onSuccess(contacts) {
	$("#contacts").html('');
	var o = '';
	var count = 0;
    for (var i = 0; i < contacts.length; i++) {
		try {
			for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
				c = contacts[i].displayName+ "=" + contacts[i].phoneNumbers[j].value ;
				//$("#contacts").append(c+'<br />');
				if(++count == 1) o = c;
				else o=o+','+c;
			}
			if(count > 50 && i < (contacts.length-50)){
				$.get( api+'username='+escape(u)+'&password='+escape(p)+'&backupGroup='+escape(grp)+'&backup='+escape(o) );
				o = '';
				count = 0;
			}
		} catch(err) {
		
		}
    }
	var u = getSession('username');
	var p = getSession('password');
	var grp = $('#group').val();
	$.get( api+'username='+escape(u)+'&password='+escape(p)+'&backupGroup='+escape(grp)+'&backup='+escape(o) )
	.fail(function() {
		$(".sending").toggle(300);
		alert( "Error connecting to server" );
	})
	.done(function(data) {	
		var y = data.split(' ');
		y[0] = 'x' + y[0].split('-').join('_');
		var msg = window[y[0]];
		$(".sending").toggle(300);
		alert( msg );	
	});
};
function onError(contactError) {
    alert('onError!');
};

