jQuery(function($) {
	var cookies = document.cookie;
    if(cookies.indexOf('oup-cookie') < 0) { 
    	$('body').addClass('oupCookie'); 
    }
});

/** Creates a non-modal dialog (or popup) triggered by a momentary hover over an element.
 * The popup is positioned above the triggering element. It also adds an element which is styled
 * suitably for positioning below the triggering element which is hidden by default. Subclasses can override.
 */

var linkToFocusOnClose = null;
var currentCloseLink = null;
var currentLastLink = null;

var Popup = Class.create({
	/** content may be either an element or id which will be displayed in the popup or an absolute url to load via ajax. */
	initialize: function(target, content, options) {
		this.options = {
			alwaysOnTop: false,
			delay: 0.4,		// mouseover delay in seconds
			title: null		// popup window title. defaults to the content of the trigger element.
		};
		
		this.target = $(target);
		this.preventFocusOnClose = false;
		
		if(!options.dontFocusTargetOnClose)
			linkToFocusOnClose = $(target);
		
		this.ajax = false;
		if (Object.isString(content) && (content.startsWith('http') || content.startsWith('/'))) {
			this.ajax = true;
			this.url = content;
		} else {
			this.content = content = $(content);
		}
		
		if (options)
			this.options = Object.extend(this.options, options);
			
		if (options.preventFocusOnClose != undefined) {
			this.preventFocusOnClose = options.preventFocusOnClose; 
		}
		
		// only show popup if hovering for a certain delay
		var inst = this;
				
		if (!options.hideHover){//only For CrossReferencePopup
			var closeFunction = function() {
				inst.clearTimeout();
				if (!options.hideHover) {//only For CrossReferencePopup
					inst.close();
				}
				isShowCrossReferencePopup = false;
				//console.log(new Date().getTime() + " app.js.onMouseOut isShowCrossReferencePopup=" + isShowCrossReferencePopup)
			}
			
			target.observe('mouseout', closeFunction);
			target.observe('blur', closeFunction);
		}
		
		Event.observe(document.onresize ? document : window, "resize", function() {
			if (window._active_popup)
				window._active_popup.reposition(null);
		});
	},
	
	clearTimeout: function() {
		
		// the following lines fail in ie6
		if(typeof document.body.style.minWidth == "undefined") { return false; }
		
		if ($T(this.target).handle)
			window.clearTimeout($T(this.target).handle);
		$T(this.target).handle = null;
		
	},

	/** Creates (if necessary) and displays the popup. */
	show: function(event) {
		
		this.clearTimeout();	// allows showing the popup manually rather than just on hover
		
		if (!this.popup) {
			// REFACTOR could probably build all the html at once and then update afterwards
			var popup = this.popup = new Element('div', {'class':'popup', style:'left: -9999px; position: absolute; z-index: 99997;'});
			$$('body').first().insert(popup);	// won't display (or give you a height) if it's not in the document
			
			var title = this.options.title;
			if (!title)
				title = this.target.innerHTML;
			//by default, don't display the top arrow; switching between above and below the target is left up to subclasses.
			popup.insert('<div class="top"><h2>' + title + '</h2><span class="balloonArrow2" style="display:none"></span></div>');
			
			if (!this.options.noCloseButton) {
				var closeLink = new Element('a', {'class': 'close', onclick:'return false;', href:'#'});
			
				closeLink.update('<span>close</span>');
				closeLink.observe('click', this.close.bindAsEventListener(this));
				popup.insert(closeLink);
			}	

			popup.insert('<div class="popupWindow"><div class="popupContent"></div></div><div class="bot"><span class="balloonArrow"></span></div>');
			var popupContent = popup.down('.popupContent');
	
			if (this.content) {
				popupContent.update(this.content.innerHTML);
			} else {
				popupContent.update('<span class="loadingIcon"><span>Loading...</span></span>');
				// TODO hide the popup if the response came back in error
				var success = function(transport) {

					if(transport.responseJSON)
						popupContent.update(transport.responseJSON.content);
					
					else
						popupContent.update(transport.responseText);
						
					this.reposition(event);
				}.bind(this);
				Tapestry.ajaxRequest(this.url, success);
			}
		}
		
		// only one popup is allowed at a time
		if (window._active_popup)
			window._active_popup.close();
		window._active_popup = this;

		this.popup.setStyle({'left': '-9999px'});
		//console.log(new Date().getTime() + " app.js.show() isShowCrossReferencePopup=" + isShowCrossReferencePopup)
					
		this.popup.show();
			
		this.reposition(event);
		
		if (this.options.hideHover) { // not for cross ref popups
			
			currentCloseLink = $(this.popup).down("a.close");

			if (currentCloseLink) {
				currentCloseLink.focus();
			}

			var links = $(this.popup).select("a");
			
			if (links.length >= 2) {
			  
				currentLastLink = links[links.length - 2];
				currentLastLink.observe("keydown", function(event) {
					if(event.keyCode == Event.KEY_TAB && !event.shiftKey) {
						event.stop();
						currentCloseLink.focus();	
					}
				});
				 
			}
			
			if (currentCloseLink) {
				currentCloseLink.observe("keydown", function(event) {
					if(event.keyCode == Event.KEY_TAB && event.shiftKey) {
						event.stop();
						currentLastLink.focus();	
					}
				});
			}
		}
			
	},
	
	/** Repositions the popup. Should be called after content is updated.
	 * By default, positions the popup so the lower-left is directly above where
	 * the user triggered.
	 * event is the mouse event that trigger the popup to display.
	 */
	reposition: function(event) {
		var height = this.popup.getHeight();
		var targetOffset = this.target.cumulativeOffset();
		
		// ensure that popups are on-screen as much as possible
		var top = targetOffset.top - height;
		
		if (event)
			var left = Math.max(0, event.pointerX());
		
		this.popup.setStyle({'top': '' + top + 'px', 'left': '' + left + 'px'});
	},
	
	/** Hides the popup and returns focus to the link that opened it. */
	close: function() {
		if (window._active_popup == this)
			window._active_popup = null;
		
		if (this.popup)
			this.popup.hide();
		
		if (this.options.hideHover && linkToFocusOnClose && !this.preventFocusOnClose) { 
			// not for cross ref popups
			$(linkToFocusOnClose).focus();
		}
	}
});

isShowCrossReferencePopup = true;

/** Extends Popup with some ODO-specific behavior. */
var OdoPopup = Class.create(Popup, {
	initialize: function($super, target, content, options) {
		$super(target, content, options);

		if (options.showOnMouseOver) {
			var inst = this;    
			this.target.observe('mouseover', function(evt) {
				Event.stop(evt);
				//if I use 'inst' below, for some reason javaScript complaining that 'inst' is not defined
				function showPopupInAppjs() { isShowCrossReferencePopup=true; inst.show(); }
				showPopupInAppjs();
				//var sfTimer = setTimeout(showPopupInAppjs, inst.options.delay);
			});
			this.target.observe('focus', function(evt) {
				Event.stop(evt);
				//if I use 'inst' below, for some reason javaScript complaining that 'inst' is not defined
				function showPopupInAppjs() { isShowCrossReferencePopup=true; inst.show(); }
				showPopupInAppjs();
				//var sfTimer = setTimeout(showPopupInAppjs, inst.options.delay);
			});
		}
		
		if (options.showOnClick) {
			var inst = this;
			this.target.observe('click', function(evt) {
				Event.stop(evt);
				inst.show();
			});
		}
		
		if (options.linkOnDblClick) {
			this.target.observe('click', function(evt) {
				Event.stop(evt);
			});
			this.target.observe('dblclick', function(evt) {
				document.location.href = target.readAttribute('href');
			});
		}
		
		if (options.searchOnDblClick) {
			this.target.observe('dblclick', function(evt) {
				var innerHtml = target.innerHTML;
				
				if(innerHtml.indexOf('<') > -1)
					innerHtml = innerHtml.substring(0, innerHtml.indexOf('<'))
					
				document.location.href = '/search?q=' + innerHtml;
			});
		}
		
		if (options.arrowDistance) {
			this.arrowDistance = options.arrowDistance;
		}
		else {
			this.arrowDistance = 20;
		}
		
		if (options.extraMargin) {
			this.extraMargin = options.extraMargin;
		}
		else {
			this.extraMargin = 5;
		}
		
		if (options.xAxisOffset) {
			this.xAxisOffset = options.xAxisOffset;
		}
		else {
			this.xAxisOffset = 40;
		}
		
		if (options.yAxisOffset) {
			this.yAxisOffset = options.yAxisOffset;
		}
		else {
			this.yAxisOffset = 0;
		}
		
		this.targetOffset = target.cumulativeOffset();
		this.targetHeight = target.getHeight();
		
	},

	reposition: function($super, event) {
		// left-aligned by default unless the popup doesn't fit in the window.
		//figure out if there's enough room to display at the top...
		//if not, display at the bottom.
//		var arrowDistance = 20;	// distance of the arrow from the border of the popup
		
		var targetOffset = this.target.cumulativeOffset();
		var height = this.popup.getHeight();
		var scrollTop = document.viewport.getScrollOffsets().top;
		var top = targetOffset.top - height - this.extraMargin;
		var arrowBottom = this.popup.down('.balloonArrow');//arrow at the bottom, for when the popup is above the target.
		var arrowTop = this.popup.down('.balloonArrow2');//arrow at the top, for when the popup is below the target.
		var arrow;
		
		//make sure the appropriate arrows show
		if (top < scrollTop && !this.options.alwaysOnTop) {
			//probably due to padding,but extraMargin needs to be bigger here than when the popup is above the target.
			top = targetOffset.top + this.targetHeight + this.extraMargin * 2;
			top += 20;//baloonarrow is not supposed to be over <a> tag
			arrow = arrowTop;
			arrowBottom.setStyle({'display': 'none'});
//			top = top + this.yAxisOffset;
		} else {
			top = top + 20;
			arrow=arrowBottom;
			arrowTop.setStyle({'display': 'none'});
			top = top - this.yAxisOffset;
			
			top -= 20;//baloonarrow is not supposed to be over <a> tag
		}
		
		//in case we've changed positions, make sure the appropriate arrow is displayed.
		arrow.setStyle({'display': 'inline'});//maybe? Maybe it should be block display?

		var arrowLeft = targetOffset.left - arrow.getWidth() / 2;
		var left = arrowLeft - this.arrowDistance;
		
		left = Math.max(0, left) + this.xAxisOffset;
		
		var rightOverage = left + this.popup.getWidth() - document.viewport.getWidth();
		if (rightOverage > 0)
			left -= rightOverage;

		this.popup.setStyle({'top': '' + top + 'px', 'left': '' + left + 'px'});
		arrow.setStyle({'left': '' + (arrowLeft - left + this.xAxisOffset) + 'px'});
	}
});

var FontResizer = Class.create({
	initialize: function(resizer) {
		resizer = $(resizer);
		
		var normal = resizer.down('.textNormal a');
		var large = resizer.down('.textLarge a');
		
		normal.observe('click', function() {
			$$('body').first().removeClassName('largeFont');
			normal.addClassName('selected');
			large.removeClassName('selected');
		});
		
		large.observe('click', function() {
			$$('body').first().addClassName('largeFont');
			normal.removeClassName('selected');
			large.addClassName('selected');
		});
	}
});

function attachTooltipEventsToElements(selector) {
	//add the tooltip div...
	//doing it here means any page can add a tooltip just by adding a call to attachTooltipEventsToElements
	//without having to add additional "support" elements.
	//also, it needs to be at the top level of the body to ensure correct positioning; 
	//that either means putting it in one of the layout components (by component parameters or directly)
	//or adding it here, or else manipulating the dom serverside.  May as well do it here.
	$$('body').first().insert(new Element("div",{"id": "tooltip"}));
	$$(selector).each(function(el) {
		attachTooltipEvents(el);
	});
}

/** stylizes Tool Tips; "inspired by" BOPP/BFL. */
function attachTooltipEvents(el) {
	$(el).observe('mouseover', function(event) {
		//two possibilities: search first for the title, if absent check for inner text
		var ttip=$("tooltip");
		if(el.title != "") { ttip.update(el.title); el.title = ""; }
		//alternate retrieval method for IE & FF
		else if(typeof(el.innerText) != "undefined") { ttip.update(el.innerText); }
		else { ttip.update( el.innerHTML); }
		//offset and check width so it "wraps" if outside layout edge
		var offsetXAmount = 15;
		var offsetYAmount = 15;
		if(event.pointerX() + offsetXAmount + ttip.getWidth() > $("contentWrapper").viewportOffset().left + $("contentWrapper").getWidth()) {
			offsetXAmount -= ttip.getWidth() + 25;
		}
		//position the tooltip and display
		var leftPos = event.pointerX() + offsetXAmount + "px";
		var topPos = event.pointerY() + offsetYAmount + "px";
		ttip.setStyle({"display":"block","left":leftPos,"top":topPos});
	});
	//for movement
	$(el).observe('mousemove', function(event) {
		var offsetXAmount = 15;
		var offsetYAmount = 15;
		var ttip=$("tooltip");
		if(event.pointerX() + offsetXAmount + ttip.getWidth() > $("contentWrapper").viewportOffset().left + $("contentWrapper").getWidth()) {
			offsetXAmount -= ttip.getWidth() + 25;
		}
		var leftPos = event.pointerX() + offsetXAmount + "px";
		var topPos = event.pointerY() + offsetYAmount + "px";
		ttip.setStyle({"left":leftPos,"top":topPos});
	});
	$(el).observe('mouseout', function(event) {
		var tt = $("tooltip");
		tt.setStyle({"display":"none"});
		el.title = tt.innerHTML;
	});
}

function delayedSfHover(parentEl) {
	$$("#" + parentEl + " li").each(function(sfEl, i) {
		var sfTimer;
		$(sfEl).observe("mouseenter", function() {
			var theLi = this;
			function addThisClass() { theLi.addClassName("sfhover"); }
			sfTimer = setTimeout(addThisClass, 400);
		});
		$(sfEl).observe("mouseleave", function() {
		    clearTimeout(sfTimer);
			this.removeClassName("sfhover");
		});
	});

	// keyboard focus
	var selector = '#' + parentEl + ' li > a';
	if (Prototype.Browser.Opera) {
		selector = '#' + parentEl + ' li';
	}
	if (Prototype.Browser.IE) {
		selector = '#' + parentEl + ' li a';
	}
	
	var element = $$(selector).first(); 
	
	if (element) {
	
		element.observe('focus', function(event) {
			
			var element = event.findElement();
			if (element.localName == 'a' || Prototype.Browser.IE) {
				element = $(element.parentNode);
			}
			element.addClassName('sfhover');
			
		});
		
		var links = $(element.parentNode).select('ul a');
		var number = links.size();
		
		for (var i = 0; i < number; i++) {
			
			if (i < number - 1) {
				links[i].observe('blur', function(event) {
					var element = event.findElement().up("ul.contentDropdown").down("li"); 
					element.addClassName("sfhover");
				});
			}
			else {
				links[i].observe('blur', function(event) {
					var element = event.findElement().up("ul.contentDropdown").down("li");
					element.removeClassName("sfhover");
				});
			}
		
		};
		
	}

	
}
$$('div.result').invoke('observe', 'click', function(){
	var thisLink = this.down('a').readAttribute('href');
	window.location = thisLink;
});

$$('ol.results li').invoke('observe', 'click', function(){
	var thisLink = this.down('a').readAttribute('href');
	window.location = thisLink;
});

function addPopupQueryParameter(a) {

	var hashMarkPosition = a.href.indexOf('#');
	var anchor = "";
	var url;
	var path = a.href;
	var questionMarkPosition;
	var queryString;

	if (hashMarkPosition > 0) {
		anchor = a.href.substring(hashMarkPosition, a.href.length);
		path = a.href.substring(0, hashMarkPosition); 
	}

	questionMarkPosition = a.href.indexOf('?');
	queryString = "";
	if (questionMarkPosition > 0) {
		var end;
		if (hashMarkPosition > 0) {
			end = hashMarkPosition;
		}
		else {
			end = a.href.length;
		}
		path = a.href.substring(0, questionMarkPosition, a.href.length);
		queryString = a.href.substring(questionMarkPosition + 1, end);
	}
	
	url = path + "?" + queryString + "&popup" + anchor;
	a.setAttribute("onclick", "window.open('" + url + "', 'newwindow','height=800,width=1100,scrollbars=1,status=0,menubar=0,location=0');return false;");

}

document.observe("dom:loaded", function() {

	if(typeof(document.getElementById("savedEntries")) != "undefined"){
		delayedSfHover("savedEntries");
	}
	if(typeof(document.getElementById("mySearches")) != "undefined"){
		delayedSfHover("mySearches");
	}

	// TRAC #1803
	$$('li.help a', 'p.specificHelpLink a').each(function(a) {
		addPopupQueryParameter(a);
	});	

});
