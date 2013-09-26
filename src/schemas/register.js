KISSY.add(function(S, oop, Handler) {

	var customTags = {};

	var RegisterHandler = new oop.Class(Handler, {
		handleInitialize2: function(cls) {
			if (cls.meta.tag) {
				customTags[(cls.meta.namespace || 'x') + '-' + cls.meta.tag] = cls;
			}
		}
	});

	function bootstrap(context) {
	    Object.keys(customTags).forEach(function(tag) {
	        var cls = customTags[tag];
	        S.all(tag, context).each(function(node) {
	        	new cls(node);
	        });
	    });
	}

	return {
		customTags: customTags,
		RegisterHandler: RegisterHandler,
		bootstrap: bootstrap
	};

}, {
	requires: ['gallery/oop/0.1/index', '../Handler']
});
