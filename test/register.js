describe('register', function() {

	it('template', function() {
		var A = new Class(ui.Component, {
			meta: {
				tag: 'mytag',
				template: '<div class="shadow"><content select="span"></content></div>'
			}
		});

		var context = S.one('<div><x-mytag><span>1</span><div>2</div><span>3</span></x-mytag></div>');
		ui.bootstrap(context);
		var component = context.one('x-mytag')[0].component;

		assert.equal(component.node.html(), '<div class="shadow"><span>1</span><span>3</span></div>');
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