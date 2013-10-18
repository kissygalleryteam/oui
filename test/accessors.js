describe('accessors', function() {

	it('define', function() {
		var A = new Class(ui.Component, {
			a: ui.define('.a')
		});

		var a = new A(S.one('<div><span class="a">A1</span><span class="a">A2</span></div>'));

		assert.equal(S.all(a.get('a')).length, 2);
	});

	it('define1', function() {
		var A = new Class(ui.Component, {
			a: ui.define1('.a')
		});

		var a = new A(S.one('<div><span class="a">A</span></div>'));

		assert.equal(a.get('a').node.innerHTML, 'A');
	});

	it('parent', function() {
		var A = new Class(ui.Component, {
			a: ui.parent('form')
		});

		var a = new A(S.one('<form><div class="component"></div></form>').one('.component'));

		assert.equal(a.get('a').node.nodeName, 'FORM')

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
		node.append(S.one(a));

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
		node.append(S.one(a1));
		node.append(S.one(a2));
		node.append(S.one(a3));
		node.append(S.one(a4));

		var B = new Class(ui.Component, {
			a: ui.define('.a')
		});

		var b = new B(node);
		assert.equal(b.a[0].m(), 1);

		b.a.forEach(function(component) {
			assert.equal(component.m(), 1);
		});

	})

});