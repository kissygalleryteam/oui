describe('register', function() {

	it('create', function() {
		var A = new Class(ui.Component, {
			meta: {
				tag: 'mytag'
			},
			m: function() {
				return 1;
			}
		});

		var node = S.one('<x-mytag />');
		assert.equal(node[0].component.m(), 1);
	});

	it('bootstrapped', function() {
		var A = new Class(ui.Component, {
			meta: {
				namcespace: 'x',
				tag: 'mytag'
			},
			m: function() {
				return 1;
			}
		});

		var context = S.one('<div><x-mytag></x-mytag></div>');
		ui.bootstrap(context);

		assert.equal(S.one('x-mytag', context)[0].component.m(), 1);
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

	it('base tag', function() {

		var A = new Class(ui.Component, {
			meta: {
				baseTag: 'form',
				tag: 'mytag'
			}
		});

		var context = S.one('<div><x-mytag class="mytag" /></div>');
		ui.bootstrap(context);

	});

});