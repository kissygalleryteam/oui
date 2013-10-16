describe('register', function() {

	it('create', function() {
		var A = new Class(ui.Component, {
			meta: {
				tag: 'mytag'
			}
		});

		assert.throws(function() {
			document.createElement('x-xxx');
		});

		var node2 = document.createElement('x-mytag');
	});

	it('bootstrapped', function() {
		var inited = false;
		var A = new Class(ui.Component, {
			meta: {
				namcespace: 'x',
				tag: 'mytag'
			},
			initialize: function(node) {
				oop.parent(this, node);
				inited = true;
			}
		});

		var context = S.one('<div><x-mytag></x-mytag></div>');
		ui.bootstrap(context);

		assert.equal(inited, 1);
	});

	it('namespace', function() {
		var A = new Class(ui.Component, {
			meta: {
				tag: 'mytag'
			}
		});

		var B = new Class(ui.Component, {
			meta: {
				namespace: 'my',
				tag: 'tag'
			}
		});

		var context = S.one('<div><x-mytag class="mytag" /><my-tag class="mytag2" /><mytag class="mytag3" /></div>');
		ui.bootstrap(context);

		assert.ok(context.one('.mytag')[0].component);
		assert.ok(context.one('.mytag2')[0].component);
		assert.ok(!context.one('.mytag3')[0].component);
	});

});