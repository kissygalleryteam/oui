describe('options', function() {

	it('basic', function() {
		var node = S.one('<input />');
		var A = new Class(ui.Component, {
			a: ui.option(1),
			b: ui.option(2)
		});
		var a = new A(node);
		a.set('b', 3);

		assert.equal(a.get('a'), 1);
		assert.equal(a.get('b'), 3);
	});

});