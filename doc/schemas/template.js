KISSY.add(function(S, oop, promise, Handler, dom, Mustache) {

	function getTemplateData(component) {
		var data = {};
		;(component.meta.data || []).forEach(function(name) {
			data[name] = component.get(name);
		});
		;(component.meta.options || []).forEach(function(name) {
			data[name] = component.get(name);
		});
		return data;
	}

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
		getShadowRoot: function(component, template) {
        	var result = S.one('<div>' + Mustache.to_html(template, getTemplateData(component)) + '</div>')[0];
			var placeholders = S.all('content', result);
			placeholders.each(function(placeholder) {
				var selector = '> ' + (placeholder.attr('select') || '*');
				var targets = S.all(selector, component.node);
				if (!targets.length) {
					targets = placeholder.children();
				}
				placeholder.replaceWith(targets);
			});
			var shadow = document.createDocumentFragment();
			var child;
			while (child = result.firstChild) {
				shadow.appendChild(child);
			}
			return shadow;
		},
		renderShadow: function(component) {
			var self = this;
			var template = self.getTemplate(component.meta);
			var shadow, temp, child;
			if (template) {
				shadow = self.getShadowRoot(component, template);
				temp = document.createDocumentFragment();
				while (child = component.node.firstChild) {
					temp.appendChild(child);
				}
				component.temp = temp;
				component.shadowRoot = shadow;
				component.node.appendChild(shadow);
				S.one(component.node).addClass('oui-loaded');
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
	requires: ['kg/oop/0.1/index', './promise', '../Handler', 'dom', 'brix/kg/mu/index', 'sizzle']
})
