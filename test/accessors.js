describe('accessors', function() {

	it('define', function() {
		var A = new Class(ui.Component, {
			a: ui.define('.a')
		});

		var a = new A(S.one('<div><span class="a">A1</span><span class="a">A2</span></div>'));

		assert.equal(a.get('a').length, 2);
	});

	it('define1', function() {
		var A = new Class(ui.Component, {
			a: ui.define1('.a')
		});

		var a = new A(S.one('<div><span class="a">A</span></div>'));

		assert.equal(a.get('a').text(), 'A');

	});

	it('parent', function() {
		var A = new Class(ui.Component, {
			a: ui.parent('form')
		});

		var a = new A(S.one('<form><div class="component"></div></form>').one('.component'));

		assert.equal(a.get('a').nodeName(), 'form')

	});

});