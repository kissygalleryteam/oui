describe('template', function() {

	it('basic', function() {
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

});