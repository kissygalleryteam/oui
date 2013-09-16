describe('registry', function() {

	it('template', function() {
		var A = new Class(ui.Component, {
			meta: {
				tag: 'mytag',
				template: '<div class="shadow"></div>'
			}
		});

		var context = S.one('<div><mytag></mytag></div>');
		ui.bootstrap(context);
		var component = context.one('mytag')[0].component;

		console.log(component.node.html());
	});

	it('bootstrapped', function() {
		var inited = false;
		var A = new Class(ui.Component, {
			meta: {
				tag: 'mytag'
			},
			initialize: function(node) {
				oop.parent(this, node);
				inited = true;
			}
		});

		var context = S.one('<div><mytag></mytag></div>');
		ui.bootstrap(context);

		assert.equal(inited, 1);
	});

});