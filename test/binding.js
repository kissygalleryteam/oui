describe('binding', function() {

	it('binding', function() {

		var A = new Class(ui.Component, {
		});

		var a = new A(document.createElement('input'));

		var data = ui.schemas.binding.wrap({
			path: {
				to: {
					value: 'a'
				}
			}
		});

		a.bind('value', data, 'path.to.value');
		
		assert.equal(a.node.value, 'a');
		data.path.to.set('value', 'b');
		assert.equal(a.node.value, 'b');

	});

	it('two-way binding', function() {
		var A = new Class(ui.Component, {
		});

		var a = new A(document.createElement('input'));

		var data = ui.schemas.binding.wrap({
			path: {
				to: {
					value: 'a'
				}
			}
		});

		a.bind('value', data, 'path.to.value');
		
		assert.equal(data.path.to.get('value'), 'a');
		a.node.value = 'b';
		S.one(a.node).fire('input');
		assert.equal(data.path.to.get('value'), 'b');

	});

	it('multiple binding', function() {
		var C = new Class(ui.Component, {
		});

		var data = ui.schemas.binding.wrap({
			path: {
				to: {
					value: 'a'
				}
			}
		});

		var a = new C(document.createElement('input'));
		var b = new C(document.createElement('input'));
		var c = new C(document.createElement('span'));

		a.bind('value', data, 'path.to.value');
		b.bind('value', data, 'path.to.value');
		c.bind('textContent', data, 'path.to.value');

		document.body.appendChild(a.node);
		document.body.appendChild(b.node);
		document.body.appendChild(c.node);

		assert.equal(a.node.value, 'a');
		assert.equal(b.node.value, 'a');
		data.path.to.set('value', 'b');
		assert.equal(a.node.value, 'b');
		assert.equal(b.node.value, 'b');

		a.node.value = 'c';
		S.one(a.node).fire('input');
		assert.equal(a.node.value, 'c');
		assert.equal(b.node.value, 'c');

	});
});

