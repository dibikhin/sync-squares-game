$(function () {		
	setInterval(refreshUsers, 25);

	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}

	function getRandomColor() {
		var colors = ['lightblue', 'lightcoral', 'lightcyan', 'lightgreen', 
			'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue'];
		return colors[Math.round(getRandomArbitrary(0, 3))];
	}

	var userList = {};
	function refreshUsers () { 
		$.get( "/users", function( data ) {
			userList = jQuery.parseJSON(data);
		});
		
		$.each( userList, function( nickName, offset ) {
			var storedNickName = $('#nickName').val();
			var user = userList[nickName];
			if(user != null) {
				if(nickName != storedNickName) {
					if ($( "#" + nickName ).length == 0) {
						$( '#origSquare' ).clone().attr('id', nickName).insertAfter( "#origSquare" )
							.css('background-color', user.color).show();
						$( '#origName' ).clone().attr('id', 'inlist' + nickName).insertAfter( "#origName" ).html(nickName)
							.css('color', user.color).show();
					}
					$( "#" + nickName ).html(nickName);
					$( "#" + nickName ).offset(user.offset);
					$( "#" + nickName ).css('background-color', user.color);
				}				
				$( '#inlist' + nickName ).css('color', user.color);
			} else {
				$( "#" + nickName ).remove();
				$( '#inlist' + nickName ).remove();
			}
		});
	}

	var newNickName = prompt('Как вас зовут?', ''); // TODO проверять существующий ник
	if (newNickName != null) {
		$(window).unload( function () { 
			$.ajax({
				type: "DELETE",
				url: "/users",
				data: { name: newNickName }
			})
		} );

		$('#nickName').val(newNickName);
		var randColor = getRandomColor();
		var newEl = $( '#origSquare' ).clone().attr('id', newNickName)
			.insertAfter( "#origSquare" )
			.css('background-color', randColor)
			.show().html(newNickName);

		$.post( "/users", { name: newNickName, offset: newEl.offset(), color: newEl.css('background-color') }); // TODO remove dups
		
		// add nickName to players' list
		$( '#origName' ).clone().attr('id', 'inlist' + newNickName).insertAfter( "#origName" ).html(newNickName)
			.css('color', randColor).show();

		$( "#" + newNickName ).draggable({ containment: "parent" });

		$( "#" + newNickName ).each( function () { // no need for 'each' :)
			var ths = this;
			function postOffset () {
				$.post( "/users", { name: newNickName, offset: $( ths ).offset(), color: $( ths ).css('background-color') }); // TODO remove dups
			};
			
			var postTimer = {};
			$( ths ).mousedown(function () {					
				$( ths ).css('background-color', getRandomColor());
				postTimer = setInterval(postOffset, 20);					
			});
			$( ths ).mouseup(function () {
				clearTimeout(postTimer);
			});
		});
	}
});