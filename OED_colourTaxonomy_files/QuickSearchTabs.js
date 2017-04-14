function switchTab(newTabId) {
    var currentTab = $$("#searchTabs li.current")[0];    
    var newTab = $(newTabId);
    
    // swap "current" class
    currentTab.removeClassName("current");
    newTab.addClassName("current");
    
    // switch text if it's still the default (or blank)
    currentDefault = currentTab.readAttribute('default');
    if (currentDefault == $F($('q')) || $F($('q')) == "") {
       $('q').value = newTab.readAttribute('default');
    }
    
    // switch form destination
    $('quickLinks').action = newTab.readAttribute('url');
}

function selectContentVersion(version, a) {
	$('contentVersion').setValue(version);
	$$('#contentVersions li').each(function(li) {
		li.removeClassName('current');
	});
	a.up('li').addClassName('current');
}

var lostForWordsPopup = null;

document.observe("dom:loaded", function() {
	
	//handle main and home search input replace
	$("q").observe('focus', function() {
		if(this.value == "Find word in dictionary") { this.value = "";this.addClassName('active') }
		else { this.select(); }
	});
	$("q").observe('blur', function() {
		if(this.value == "") { this.value = "Find word in dictionary";this.removeClassName('active') }
	});
	
	$('lostForWordsLink').observe('click', function(event) {
		
		if (lostForWordsPopup == null) {
			lostForWordsPopup = 
				new OdoPopup($('lostForWordsLink'), $('lostForWords'), {title:'Lost for Words?', showOnClick:true, hideHover:true});
		}
			
		lostForWordsPopup.show(null);
		
	});
	
	$('q').observe('keypress', function(event) {
		if (event.keyCode == Event.KEY_RETURN && ($('q').getValue() == '' || $('q').getValue() == 'Find word in dictionary')) {
        	Event.stop(event);
        }
	});
	
	$('searchBtn').observe('click', function(event) {
		if ($('q').getValue() == '' || $('q').getValue() == 'Find word in dictionary') {
			Event.stop(event);
		}
	});

});