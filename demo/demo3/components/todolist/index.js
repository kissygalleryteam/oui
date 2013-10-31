KISSY.add(function(S, oop, ui, json) {

	var keyboard = ui.schemas.keyboard;

	var Todolist = new oop.Class(ui.Component, {

		__factory: json,

		add: function(text, done) {
			var self = this;
			self.get('data').push({
				text: text,
				done: Boolean(done)
			});
		},

		mark: function() {

		},

		marker_onClick: function() {
			this.mark();
		}

	});

	return Todolist;

}, {
	requires: [
		'gallery/oop/0.1/index',
		'gallery/oui/0.2/index',
		'./component.json',
		'./template.mustache'
	]
});