describe('template', function() {

	it('shadow template', function() {
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

	it('render', function(done) {
		var A = new Class(ui.Component, {
			a: ui.define('.a', {
				'template-from': '#template'
			})
		});

		S.one(document.body).append('<div id="render"><script type="template" id="template"><span class="a">A1</span></script></div>');
		var a = new A(S.one('#render'));
		a.render('a', null, function() {
			assert.equal(a.get('a').length, 1);
			done();
		});
	});

});