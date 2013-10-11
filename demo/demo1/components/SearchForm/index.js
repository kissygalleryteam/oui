KISSY.add(function(S, oop, ui, json, SearchSuggests) {

	var promise = ui.schemas.promise;

	var SearchForm = new oop.Class(ui.Component, {

		__factory: json,

        showSuggests: promise.promise(function(callback) {
            var self = this;
        	var key = self.get('input').val();

        	if (!self.get('suggests')) {
        		return;
        	}

        	self.get('suggests').load(key, callback);
    	}),

        hideSuggests: function() {
        	var self = this;
        	self.get('suggests').unload();
        },

	});

	return SearchForm;

}, {
	requires: [
		'gallery/oop/0.1/index',
		'gallery/oui/0.1/index',
		'./component.json',
		'../SearchSuggests/index',
		'./template.mustache'
	]
});