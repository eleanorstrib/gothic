var Arachne = {
	/* for use with jsonautocomplete for mapping values in the json metadata for a specific item
	 * to a set of fields to update for each value.
	 * fields maps the metadata keys to field id's that should be updated with those values
	 * usage will look something like this:
	 * Arachne.mapAutocompleteFields.curry({isbn:'${isbnField.clientId}',title:'${titleField.clientId}'})
	 */
	// REFACTOR move into JSONAutocomplete
	mapAutocompleteFields: function(fields, autocomplete, metadata) {
		for(var key in fields) {
			$(fields[key]).setValue(metadata[key]);
		}
		
		return true;
	},
	
	/** Allows programatically clicking the link that is connected to a zone */
	// this is a hack for not being able to fire a 'click' event. (sigh)
	clickZoneLink: function(zoneLink, zoneDiv) {
		var successHandler = function(transport)
        {
			var zm = Tapestry.findZoneManager(zoneLink);
            zm.processReply(transport.responseJSON);  
        };
        
        Tapestry.ajaxRequest($(zoneLink).href, successHandler);
	}
};

/* Tracks the last timestamp of an ajax update in Ajax.lastUpdate */
if (Ajax != undefined) {
	var updated = function() {
		Ajax.lastUpdate = new Date().getTime();
	};
	
	var started = function() {
		//clear out lastUpdate b/c we've started a new ajax request.
		//note that waitForUpdate now checks to make sure lastUpdate isn't null.
		Ajax.lastUpdate = null;
	};
		
	//we /don't/ defer for onComplete b/c onComplete executes only after
	//any request-related javascript executes.
	Ajax.Responders.register({ 
		onComplete: function() { updated(); },
		onCreate: function() { started(); }
	});	
	//we defer here in case there's anything else that needs to be done first.
	document.observe('dom:loaded', function() { updated.defer(); });
}

// temporary fix for https://issues.apache.org/jira/browse/TAP5-204
Tapestry.Validator.email = function(field, message) {
	field.addValidator(function(value) {
        if (value.search(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i) == -1)
        	throw message;
	 });
}

//Tapestry's default reorderSelected function is broken in IE (uses the wrong type for 'before' in IE).
//See https://issues.apache.org/jira/browse/TAP5-261.
//once that issue is fixed, this workaround can be removed.
if (Tapestry.Palette != undefined) {
	Tapestry.Palette = Class.create(Tapestry.Palette, {
	    reorderSelected : function(movers, before)
	    {
	        movers.each(function(option)
	        {
	            this.addOption(this.selected,option,before);
	        }.bind(this));
	
	        this.updateHidden();
	        this.updateButtons();
	    },
	    
	    addOption : function(to,option,before) {
	        try
	        {
	            to.add(option, before);
	        }
	        catch (ex)
	        {
	            //probably IE complaining about type mismatch for before argument;
	            if (before == null)
	            {
	                //just add to the end...
	                to.add(option);
	            }
	            else
	            {
	                //use option index property...
	                to.add(option, before.index);
	            }
	        }
	    }
	});
}

/* Internet explorer triggers the onchange event where most browsers 
 * trigger the onblurafterchange event.  This means that if you click
 * a checkbox it won't trigger onchange until you click somewhere else
 * or tab.  This fix registers and onpropertychange listener for checkboxes
 * in IE to work around the problem. */
Tapestry.onDOMLoaded(function() {
	if (Prototype.Browser.IE) {
	 var inputs = document.getElementsByTagName("input"), i=-1, l=inputs.length;
	 while (++i!==l) {
	  var inputs_i=inputs[i];
	  if ((inputs_i.type=="checkbox")&&inputs_i.onchange) {
	   inputs_i._onchange=inputs_i.onchange;
	   inputs_i.onchange=null;
	   inputs_i.onpropertychange=function() {if (event.propertyName=='checked') this._onchange();};
	  }
	 }
	}
});

function setDomLoaded() {
	document.domLoaded=true;
}
