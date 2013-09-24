KISSY.add(function(S, oop, Handler) {

	var customTags = {};

	var RegisterHandler = new oop.Class(Handler, {
		renderShadow: function(component) {
			var shadow, nodes, placehoders;
			var template = component.meta.template;
			if (template) {
				shadow = document.createDocumentFragment();
				S.all(template).appendTo(shadow);
				placeholders = S.all(shadow.querySelectorAll('content'));
				placeholders.each(function(placeholder) {
					var selector = placeholder.attr('select') || '*';
					var targets = component.node.all(selector);
					placeholder.replaceWith(targets);
				});
			}
			if (shadow) {
				component.node.html('');
				component.node.append(shadow);
			}
		},
		handleInitialize2: function(cls) {
			if (cls.meta.tag) {
				customTags[(cls.meta.namespace || 'x') + '-' + cls.meta.tag] = cls;
			}
		},
		handleInitialize: function(component) {
			var self = this;

			self.renderShadow(component);
		}
	});

	function bootstrap(context) {
	    Object.keys(customTags).forEach(function(tag) {
	        var cls = customTags[tag];
	        new cls(S.one(tag, context));
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
