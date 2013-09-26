KISSY.add(function(S, oop, ui, template) {
	var Searchbar = new oop.Class(ui.Component, {
		meta: {
			tag: 'searchbar',
			template: template
		},
        input: ui.define1('input'),
        input_oninput: function(event) {
            console.log(event.target.value)
        }
	});
	return Searchbar;
}, {
	requires: ['gallery/oop/0.1/index', 'gallery/oui/0.1/index', './template.mustache']
});