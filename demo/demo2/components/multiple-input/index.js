KISSY.add(function(S, oop, ui, json) {

	var keyboard = ui.schemas.keyboard;

	var MultipleInput = new oop.Class(ui.Component, {

		__factory: json,

		value: oop.property(function() {
			var self = this;
			var result = [];
			self.get('items').forEach(function(item) {
				result.push(S.one(item).val());
			});
			return result;
		}),

		onCreate: function() {
			var self = this;
			self.originInput = S.one(self.get('lastItem')).clone(true);
		},

		_createItem: function() {
			var self = this;
			var input = S.one(self.originInput).clone(true);
			var removeButton = (S.one(self.temp).one('.x-multipleinput-remove-button') || S.one('<button class="x-multipleinput-remove-button">删除</button>')).clone(true);
			var item = S.one('<div class="item"> </div>');
			item.prepend(input);
			item.append(removeButton);
			return item[0];
		},

		add: function() {
			var self = this;
			if (self.get('maxCount') >= 0 && self.get('items').length >= self.get('maxCount')) {
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
				event.preventDefault();
				self.add();
				self.get('lastItem').node.focus();
			}
		}),

		handleRemove: keyboard.keycode(8)(function(event) {
			var self = this;
			var input = event.target;
			if (!S.one(input).val()) {
				event.preventDefault();
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