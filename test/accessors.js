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

	it('define1 component', function() {
		var A = new Class(ui.Component, {
			m: function() {
				return 1;
			}
		});
		var a = new A(S.one('<span class="a">a</span>'));

		var B = new Class(ui.Component, {
			a: ui.define1('.a')
		});

		var node = S.one('<div />');
		node.append(a);

		var b = new B(node);
		assert.equal(b.a.m(), 1);
	});

	it('define components', function() {
		var A = new Class(ui.Component, {
			m: function() {
				return 1;
			}
		});

		var a1 = new A(S.one('<span class="a">a</span>'));
		var a2 = new A(S.one('<span class="a">a</span>'));
		var a3 = new A(S.one('<span class="a">a</span>'));
		var a4 = new A(S.one('<span class="a">a</span>'));

		var node = S.one('<div />');
		node.append(a1);
		node.append(a2);
		node.append(a3);
		node.append(a4);

		var B = new Class(ui.Component, {
			a: ui.define('.a')
		});

		var b = new B(node);
		assert.equal(S.one(b.a.item(0)).m(), 1);

		b.a.each(function(item) {
			assert.equal(S.one(item).m(), 1);
		});

	})

});