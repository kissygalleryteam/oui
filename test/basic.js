describe('basic', function() {

	it('component.node is a wrapped node', function() {
		var A = new Class(ui.Component, {
		});

		var node1 = S.one('<div>1</div>');
		var node2 = S.one('<div>2</div>')[0];

		var a1 = new A(node1);
		var a2 = new A(node2);

		assert.equal(a1.node.text(), '1');
		assert.equal(a2.node.text(), '2');
	});

	it('component._node is a pure node', function() {
		var A = new Class(ui.Component, {
		});

		var node1 = S.one('<div>1</div>');
		var node2 = S.one('<div>2</div>')[0];

		var a1 = new A(node1);
		var a2 = new A(node2);

		assert.equal(a1._node.innerHTML, '1');
		assert.equal(a2._node.innerHTML, '2');
	});

	it('init component must wrap a node', function() {
		var A = new Class(ui.Component, {
		});

		assert.throws(function() {
			var a = new A();
		});
	});

	it('init component with same node throw error', function() {

		var A = new Class(ui.Component, {
		});

		var B = new Class(ui.Component, {
		});

		var node = S.one('<div></div>');
		var a = new A(node);
		assert.throws(function() {
			var b = new B(node);
		});
	});

});