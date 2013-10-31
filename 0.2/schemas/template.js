KISSY.add(function(S, oop, promise, Handler, dom, Mustache) {

	var TemplateHandler = new oop.Class(Handler, {
		getTemplate: function(options) {
			options = options || {};

			var template;
			if (options['template']) {
				template = options['template'];
			} else if (options['template-from']) {
	        	template = S.one(options['template-from']).html();
			} else if (options['template-module']) {
				template = S.require(options['template-module']);
			}
			return template;
		},
		getRenderPoint: function(options) {
	        return S.one(options['template-from']);
		},
		renderShadow: function(component) {
			var self = this;
			var shadow, nodes, placehoders;
			var template = self.getTemplate(component.meta);
			var temp;
			if (template) {
				shadow = document.createDocumentFragment();
				S.all(template).appendTo(shadow);
				placeholders = S.all(shadow.querySelectorAll('content'));
				placeholders.each(function(placeholder) {
					var selector = placeholder.attr('select') || '*';
					var targets = S.all(selector, component.node);
					if (!targets.length) {
						targets = placeholder.children();
					}
					placeholder.replaceWith(targets);
				});
			}
			if (shadow) {
				temp = document.createDocumentFragment();
				S.one(component).children().each(function(node) {
					node.appendTo(temp);
				});
				component.temp = temp;
				S.one(component).html('');
				S.one(component).append(shadow);
			}
		},
		handleNew: function(metaclass, name, base, dict) {
			var self = this;
	        var func = function(name, data, callback) {
	        	var member = this.__properties__[name];
	        	var template = self.getTemplate(member);
	        	var result = Mustache.to_html(template, data);
	        	var point = self.getRenderPoint(member);
	        	if (point) {
	        		dom.insertBefore(S.one(result), point);
	        	} else {
	        		this.append(result);
	        	}
	        	callback();
	        }

	        dict.render = promise.promise(func);
	    },
		handleInstance: function(component) {
			var self = this;

			self.renderShadow(component);
		}
	});

	return {
		TemplateHandler: TemplateHandler
	};

}, {
	requires: ['gallery/oop/0.1/index', './promise', '../Handler', 'dom', 'brix/gallery/mu/index', 'sizzle']
})
