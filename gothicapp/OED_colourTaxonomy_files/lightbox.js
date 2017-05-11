var currentLightbox = null;
function showLightbox(url, width, height) {
	showLightbox(url, width, height, '&nbsp;');
}

function showLightbox(url, width, height, title) {
	// don't specify an id or we get errors on opening new one's too eagerly
	var win = new Window({
		minimizable : false,
		maximizable : false,
		draggable : true,
		destroyOnClose: true,
		width : width,
		height : height,
		url : url,
		recenterAuto: false,
		title: title,
		zIndex: 10000
	});
	
	currentLightbox = win;
	
	win.showCenter(true, 80);
	
	Event.observe($(currentLightbox.getId() + "_content"), "load", function(){
		Event.observe($(currentLightbox.getId() + "_content").contentDocument, 'keyup', 
			function(event){ 
				if(event.keyCode == Event.KEY_ESC) {
					currentLightbox.close();
				}
			}
		);
	});
	
	Event.observe((document), 'keyup', 
		function(event){ 
			if(event.keyCode == Event.KEY_ESC) {
				currentLightbox.close();
			}
		}
	);
	
}


