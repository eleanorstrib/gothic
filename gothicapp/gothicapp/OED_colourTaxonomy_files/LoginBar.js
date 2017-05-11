var LoginBar = {
  
    init: function(startOpened, homepageUrl) {
        if (!startOpened) {
             $("loginState").addClassName("closed");
        }
        else {
        	$("loginState").show();
        	if ( $("loginWithoutJS") != undefined) {
        		$("loginWithoutJS").href="#";
        		$("loginWithoutJS").observe('click', function() { LoginBar.show(); });
        	}
        }
        
        var openButton = $('openLoginBar');
        if (openButton != null) {
        	openButton.writeAttribute('href', '#');
            openButton.observe('click', onClickLoginTop);
        }
        
        //are the next 4 lines ever used? 
        var openButtonTop = $("openLoginBarTop");
        if (openButtonTop != null) {
            openButtonTop.observe('click', onClickLoginTop);
        }
        
        var closeButton = $$("#loginBar #closeLoginPanel a").first();       
        if (closeButton != null) {
        	closeButton.href = homepageUrl;
            /* closeButton.observe('click', function(evt) {
                LoginBar.hide();
                Event.stop(evt);
            }); */
        }

		var ie9plus = getInternetExplorerVersion() >= 9;
		var fakeLabel = $('fakeSubLoginPasswordLabel');
		$("subLoginPassword").value = "";
		
		if (ie9plus) {
			var usernameLabel = $('subLoginUsernameLabel').remove();
			var passwordLabel = $('subLoginPasswordLabel').remove();
			var body = $$('body').first();
			body.insert(usernameLabel);
			body.insert(passwordLabel);
		}

        fakeLabel.addClassName("visible");
        $('subLoginPassword').addClassName('invisible');

        //handle text box replace
        // if($("subLoginPassword").value == "") { 
        //	fakeLabel.addClassName("visible"); 
        // }
        
        $("subLoginPassword").observe('focus', function() {
			fakeLabel = $('fakeSubLoginPasswordLabel');
			fakeLabel.addClassName("invisible").removeClassName("visible"); 
        });
        $("subLoginPassword").observe('blur', function() {
        	fakeLabel = $('fakeSubLoginPasswordLabel');
        	if(this.value == "") { 
        		fakeLabel.addClassName("visible").removeClassName("invisible");
        		if (ie9plus) {
        			fakeLabel.show();
        		} 
        	}
        	else {
       			fakeLabel.removeClassName("visible").addClassName("invisible");
        		if (ie9plus) {
        			fakeLabel.hide();
        		}
        	}
        });
	        
        $("subLoginUsername").observe('focus', function() {
        	if(this.value == "Username" || this.value == "username") { 
        		this.value = ""; 
        	}
        });
        $("subLoginUsername").observe('blur', function() {
        	if(this.value == "") { 
        		this.value = "Username"; 
        	}
        });
        
        $("libLoginCard").observe('focus', function() { if(this.value == "Library card number") { this.value = ""; } });
        $("libLoginCard").observe('blur', function() { if(this.value == "") { this.value = "Library card number"; } });

        // IE8 fix, since forms don't submit upon rendering show() on HTML
        // See: http://stackoverflow.com/questions/1795985/ie8-form-within-a-hidden-div-return-key-no-longer-works
		if (!Prototype.Browser.Gecko) {
			// The Enter key press event is captured in Firefox when selecting an item from the autocomplete menu
			$("subLoginUsername").observe('keydown', function(evt) { if(evt.keyCode == 13) { $("subLoginForm").submit(); } });
			$("libLoginCard").observe('keydown', function(evt) { if(evt.keyCode == 13) { $("libLoginForm").submit(); } });
		}
		$("subLoginPassword").observe('keydown', function(evt) { if(evt.keyCode == 13) { $("subLoginForm").submit(); } });
		$("subLoginBtn").observe('keydown', function(evt) { 
			if(evt.keyCode == 13) { 
				$("subLoginForm").submit(); 
			} 
		});
		$("libLoginBtn").observe('keydown', function(evt) { if(evt.keyCode == 13) { $("libLoginForm").submit(); } });
    },
    
    // bar appears
    show: function() {
        //console.log("slide down!");
    	if($$("body.publicPages").length > 0) { $("loginState").setStyle({display:"block"}); }
        $("loginBackdrop").setStyle({ display: "block" });
        $("loginBarWrap").setStyle({ display: "block" });
        new Effect.Move("loginBarWrap", {
            x: 0,
            y: 0,
            mode: "absolute",
            duration: .65,
            afterFinish: function(effect) {
                $("loginState").removeClassName("closed");
            }
        });
        $("subLoginUsername").focus();
    },
    
    // bar hides
    hide: function() {
        //console.log("slide up!");
        new Effect.Move("loginBarWrap", {
            x: 0,
            y: -156,
            mode: "absolute",
            duration: .65,
            afterFinish: function(effect) {
                $("loginBackdrop").setStyle({ display: "none" });
                $("loginBarWrap").setStyle({ display: "none" });
                $("loginState").addClassName("closed");
            }
        });
    } 
    
}

function onClickLoginTop() {
     if($("loginState").hasClassName("closed")) {
         LoginBar.show();
     }
     else {
         LoginBar.hide();
     }
}

function getInternetExplorerVersion() {
	// Returns the version of Internet Explorer or a -1
	// (indicating the use of another browser).
	var rv = -1; // Return value assumes failure.
	var ua = window.navigator.userAgent;
	if (ua.indexOf("MSIE ")>-1) {
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			rv = parseFloat(RegExp.$1);
		}
	} 
	if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		rv = 11;
	}
	if (ua.indexOf("Edge/")>-1) {
		rv=99;
	} 
	return rv;
}