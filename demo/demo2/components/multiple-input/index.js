KISSY.add(function(S, oop, ui, json) {

	var keyboard = ui.schemas.keyboard;

	var MultipleInput = new oop.Class(ui.Component, {

		__factory: json,

		_createItem: function() {
			var self = this;
			var item = S.one('<div class="item"><input type="text" /><button class="remove">删除</button></div>');
			return item[0];
		},

		add: function() {
			var self = this;
			if (self.get('items').length >= self.get('maxCount')) {
				return;
			}
			var newItem = self._createItem();
			S.one(self.get('items')[self.get('items').length - 1]).parent('div.item').after(newItem);
		},

		remove: function(item) {
			var self = this;
			if (self.get('items').length <= 1) {
				return;
			}
			S.one(item).parent('div.item').remove();
		},

		handleAdd: keyboard.keycode(13)(function(event) {
			var self = this;
			var input = event.target;
			if (S.one(input).val()) {
				self.add();
				self.get('lastItem').node.focus();
			}
		}),

		handleRemove: keyboard.keycode(8)(function(event) {
			var self = this;
			var input = event.target;
			if (!S.one(input).val()) {
				self.remove(input);
				self.get('lastItem').node.focus();
			}
		})

	});

	return MultipleInput;

}, {
	requires: [
		'gallery/oop/0.1/index',
		'gallery/oui/0.2/index',
		'./component.json',
		'./template.mustache'
	]
});