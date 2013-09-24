KISSY.add(function(S, oop, Handler) {

	var TemplateHandler = new oop.Class(Handler, {
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
		handleInitialize: function(component) {
			var self = this;

			self.renderShadow(component);
		}
	});

	return {
		TemplateHandler: TemplateHandler
	};

}, {
	requires: ['gallery/oop/0.1/index', '../Handler']
})
