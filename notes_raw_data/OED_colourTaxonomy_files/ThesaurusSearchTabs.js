document.observe("dom:loaded", function() {
	
	//handle main and home search input replace
	$("thesaurusSearchTerm").observe('focus', function() {
		if($("thesaurusSearchTerm").value == "Within Historical Thesaurus") { 
			$("thesaurusSearchTerm").value = ""; 
			$("thesaurusSearchTerm").addClassName("active");
		}
	});
	$("thesaurusSearchTerm").observe('blur', function() {
		if($("thesaurusSearchTerm").value == "") { 
			$("thesaurusSearchTerm").value = "Within Historical Thesaurus"; 
			$("thesaurusSearchTerm").removeClassName("active");
		}
	});

});