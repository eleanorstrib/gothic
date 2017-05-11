var lastCurrentLink;

document.observe("dom:loaded", function() {

	setContentLinkClick();

	// TRAC #447
	Ajax.Responders.register( {
		onCreate : function() {
			var current = $$('a.current').first();
			lastCurrentLink = 'thesaurus-' + current.className.match(/[\d]+/);
			$('historical').addClassName('current');
		},
		onComplete : function() {
			$('historical').addClassName('current');
		}
	});
	
//	$$('.contentLink').each(function(link) {
//		link.observe('click', function(event) {
//			event.findElement().addClassName('current');
//			link.addClassName('current');
//		});
//	});
	
});

function setContentLinkClick() {

	$$(".contentLink").each(function(e) {
		e.observe("click", function(event) {

			$$(".current").each(function(e) {
				e.removeClassName("current");
			});
			event.findElement().addClassName("current");

			window.scrollTo(0, 125);
		});
	});
	
	if (lastCurrentLink) {
		$$('.' + lastCurrentLink).first().addClassName('current');
	}
	
}

function resetAllHighlightedItems(exception) {
	$$(".contentLink").each(function(e) {
		if (exception && e.className.indexOf(exception) < 0) {
			e.removeClassName("current");
		}
	});
}

document.observe("dom:loaded", function() {
	sortInstancesByEntryTitle(false);
	$$('#contentZone .sortBy a').each(function(item, index){
		item.toggleClassName('on');
	});	
});


function sortInstancesByEntryTitle(entry){
	var original = new Array();
	var sortField = new Array();
	var secondarySortField = [];
	var sorted = new Array();
	$$('#colRight .entry').each(function(item, index){//index 0 based
		original[index] = item;
		if (entry) {
			sortField[index] = item.getElementsByClassName('sortAlpha')[0].value;
		} else {
			sortField[index] = parseFloat(item.getElementsByClassName('sortDate')[0].value);

			//because we need secondary search, that s why just '1967' is not enough
			secondarySortField[index] = item.getElementsByClassName('sortAlpha')[0].value;
		}
	});
	original = copyArray(original);
	sorted = bubbleSort(original, sortField, 0, original.length - 1, entry, secondarySortField);

	
	$$('#colRight .entry').each(function(item, index){//index 0 based
		var element = sorted[index];
		item.update( element.innerHTML);
	});

	$$('#contentZone .sortBy a').each(function(item, index){
		item.toggleClassName('on');
	});		
}

function bubbleSort(inputArray2, sortFieldArray, start, rest, asc, secondarySortField) {
	//we do that because assign operator "=" in javaScript do not create new Object, it just reference existent Object
	inputArray = copyArray(inputArray2);
	for ( var i = rest - 1; i >= start; i--) {
		for ( var j = start; j <= i; j++) {
			if ((sortFieldArray[j + 1] < sortFieldArray[j])
					|| (
						(sortFieldArray[j + 1] == sortFieldArray[j])
						&& (secondarySortField.length > 0)
						&& (secondarySortField.length[j + 1] < secondarySortField.length[j])
						)) {
				var tempValue = inputArray[j];
				inputArray[j] = inputArray[j + 1];
				inputArray[j + 1] = tempValue;

				var tempValue1 = sortFieldArray[j];
				sortFieldArray[j] = sortFieldArray[j + 1];
				sortFieldArray[j + 1] = tempValue1;

				if (secondarySortField.length > 0) {
					var tempValue2 = secondarySortField.length[j];
					secondarySortField.length[j] = secondarySortField.length[j + 1];
					secondarySortField.length[j + 1] = tempValue2;
				}
			}
		}
	}
	return inputArray;
}

function copyArray(inputArray) {
	var newArray = new Array();
	for (var i=0; i < inputArray.length; i++){
		var element = inputArray[i];
		
		var a = new Element('a');
		var originalLink = $(element).down('a');
		a.href = originalLink.href;
		a.innerHTML = originalLink.innerHTML; 
		var span = new Element('span');
		span.innerHTML = $(element).down('span').innerHTML;
		var h3 = new Element('h3');
		h3.insert(a);
		h3.insert(span);
		var p = new Element('p');
		p.innerHTML = $(element).down('p').innerHTML;
		
		var inputAlpha = new Element('input');
		var originalInputAlpha = $(element).down('input.sortAlpha');
		inputAlpha.name = 'sortAlpha';
		inputAlpha.addClassName('sortAlpha');
		inputAlpha.type = 'hidden';
		inputAlpha.value = originalInputAlpha.value;
		
		var inputDate = new Element('input');
		var originalInputDate = $(element).down('input.sortDate');
		inputDate.name = 'sortDate';
		inputDate.addClassName('sortDate');
		inputDate.type = 'hidden';
		inputDate.value = originalInputDate.value;
		
		var div = new Element('div');
		div.insert(h3);
		div.insert(p);
		div.insert(inputAlpha);
		div.insert(inputDate);
		newArray[i] = div;
	}
	return newArray;
}