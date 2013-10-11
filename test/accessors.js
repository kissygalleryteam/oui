describe('accessors', function() {

	it('basic', function() {
		var A = new Class(ui.Component, {
			a: ui.define('.a'),
			b: ui.define1('.b')
		});

		var a = new A(S.one('<div><span class="a">A1</span><span class="b">B</span><span class="a">A2</span></div>'));

		assert.equal(a.get('a').length, 2);
		assert.equal(a.get('b').text(), 'B');
	});

});