KISSY.add(function(S, oop, promise, Handler, dom, Mustache) {

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
		handleNew: function(metaclass, name, base, dict) {
	        var func = function(name, data, callback) {
	        	var templateNode = S.one(this.__properties__[name].options['template-from']);
	        	var template = templateNode.html();
	        	var result = Mustache.to_html(template, data);
	        	if (templateNode) {
	        		dom.insertBefore(S.one(result), templateNode);
	        	} else {
	        		this.node.append(result);
	        	}
	        	callback();
	        }

	        dict.render = promise.promise(func);
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
	requires: ['gallery/oop/0.1/index', './promise', '../Handler', 'dom', 'brix/gallery/mu/index']
})
