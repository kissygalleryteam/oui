describe('data', function() {

	it('binding', function() {

		var A = new Class(ui.Component, {
			data: ui.data({
				value: {
					path: {
						to: {
							value: 1
						}
					}
				},
				bind: {
					'value': 'path.to.value'
				}
			})
		});

		var a = new A(document.createElement('input'));

		a.data.path.to.set('value', 2);
		assert.equal(a.node.value, 2);
	});

});

