describe('events', function() {

	it('on event', function() {
		var eventCalled = 0;
		var node = S.one('<input />');

		var A = new Class(ui.Component, {
			onclick: function(event) {
				eventCalled++;
			}
		});

		var a = new A(node);
		a.node.fire('click');
		
		assert.strictEqual(eventCalled, 1);
	});

	it('sub event', function() {

		var eventCalled = 0;
		var node = S.one('<div><input /></div>');

		var A = new Class(ui.Component, {
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
