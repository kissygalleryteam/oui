describe('component', function() {

	it('sub event', function() {

		var eventCalled = 0;

		var node = S.one('<div><input /></div>');

		var A = new oop.Class(ui.Component, {
			input: ui.define1('input'),
			input_onclick: function() {
				eventCalled++;
			}
		});

		var a = new A(node);

		a.input.fire('click');

		assert.strictEqual(eventCalled, 1);
	});

});
