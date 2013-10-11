describe('options', function() {

	it('basic', function() {
		var node = S.one('<input />');
		var A = new Class(ui.Component, {
			a: ui.option(1),
			b: ui.option(2),
			c: ui.option(3)
		});
		var a = new A(node);
		a.set('b', 3);
		a.set('c', '4');

		assert.equal(a.get('a'), 1);
		assert.equal(a.get('b'), 3);
		assert.strictEqual(a.get('c'), 4);
	});

	it('attribute', function() {

		var node = S.one('<input a="2" />');
		var A = new Class(ui.Component, {
			a: ui.option(1, {
				attribute: true
			})
		});
		var a = new A(node);

		assert.strictEqual(a.get('a'), 2);

		a.set('a', 3);
		assert.strictEqual(a.get('a'), 3);
	});

});