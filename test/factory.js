describe('factory', function() {

	it('extended', function() {

		var Base = new Class(ui.Component, {
		});

		var A = new Class(Base, {
			__factory: {
				meta: {
					define1: ['test']
				},
				test: {
					selector: '.test1'
				}
			}
		});

		var B = new Class(Base, {
			__factory: {
				meta: {
					define1: ['test']
				},
				test: {
					selector: '.test2'
				}
			}
		});

		var a = new A(S.one('<div><span class="test1"></span></div>'));
		var b = new B(S.one('<div><span class="test2"></span></div>'));

		assert.equal(a.get('test')[0].className, 'test1');
		assert.equal(b.get('test')[0].className, 'test2');

	});

});