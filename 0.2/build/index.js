/*
combined files : 

gallery/oui/0.2/handler
gallery/oui/0.2/schemas/options
gallery/oui/0.2/schemas/accessors
gallery/oui/0.2/schemas/binding
gallery/oui/0.2/schemas/promise
gallery/oui/0.2/schemas/time
gallery/oui/0.2/schemas/data
gallery/oui/0.2/Handler
gallery/oui/0.2/schemas/template
gallery/oui/0.2/schemas/events
gallery/oui/0.2/schemas/register
gallery/oui/0.2/schemas/factory
gallery/oui/0.2/schemas/keyboard
gallery/oui/0.2/index

*/
KISSY.add('gallery/oui/0.2/handler',function(S, oop) {

var Class = oop.Class;

var Handler = new Class({
	handleNew: function(metaclass, name, base, dict) {},
    handleMeta: function(meta) {},
    handleMember: function(cls, name, member) {},
    handleInitialize: function(cls) {},
    handleInstance: function(component) {}
});

return Handler;

}, {
    requires: ['gallery/oop/0.1/index']
})
KISSY.add('gallery/oui/0.2/schemas/options',function(S, oop, Handler) {

function getMember(obj, name) {
	if (name in obj.__properties__) {
		return obj.__properties__[name];
	} else {
		return obj[name];
	}
}

function mergeOptions(p, options) {
	Object.keys(options).forEach(function(key) {
		p[key] = options[key];
	});
}

function option(value, options) {
	var p = oop.property(function() {
		return this.getOption(p.__name__) || p.defaultValue;
	}, function(value) {
		this.setOption(p.__name__, value);
	});
	p.uitype = arguments.callee;
	p.defaultValue = value;
	mergeOptions(p, options || {});
	return p;
}

var OptionsHandler = new oop.Class(Handler, {
	handleNew: function(metaclass, name, base, dict) {
		dict.getOption = this.getOption;
		dict.setOption = this.setOption;
	},
	setOption: function(name, value) {
		var self = this;

		var member = getMember(self, name);
		if (member) {
			if (value && typeof value == 'object') {
				Object.keys(value).forEach(function(subName) {
					var subValue = value[subName];
					if (subName == 'value' && member.writable) {
						self[name] = subValue;
					} else {
						member[subName] = subValue;
					}
				});
			} else {
				self['__' + name] = value;
			}
		}
	},
	getOption: function(name) {
		var self = this;

		var value;
		var member = getMember(self, name);
		var type = member.defaultValue.constructor;
		if (self['__' + name]) {
			value = type(self['__' + name]);
		} else if (member.attribute) {
			value = type(S.one(self.node).attr(name));
		}
		return value;
	}
});

return {
	option: option,
	OptionsHandler: OptionsHandler
}

}, {
	requires: ['gallery/oop/0.1/index', '../handler']
});
KISSY.add('gallery/oui/0.2/schemas/accessors',function(S, oop, Handler) {

var wrap;

var Class = oop.Class;

function define(selector, options) {
    options = options || {};

    var prop = oop.property(function() {
        var method = prop.method || 'all';
        var node = S.one(this.node)[method](prop.selector);

        if (method == 'parent' || method == 'one') {
            return wrap(node[0]);
        } else if (method == 'all') {
            var arr = [];
            node.each(function(item) {
                arr.push(wrap(item[0]));
            });
            return arr;
        }
    });
    prop.uitype = arguments.callee;
    prop.selector = selector;
    Object.keys(options).forEach(function(key) {
        prop[key] = options[key];
    });
    return prop;
}

function define1(selector, options) {
    options = options || {};
    options.method = 'one';

    return define(selector, options);
}

function parent(selector, options) {
    options = options || {};
    options.method = 'parent';

    return define(selector, options);
}

return {
	define1: define1,
	define: define,
    parent: parent,
    bind: function(func) {
        wrap = func;
    }
}

}, {
	requires: ['gallery/oop/0.1/index', '../handler']
});
KISSY.add('gallery/oui/0.2/schemas/binding',function(S, oop, Handler) {

function BindableObject(obj) {
	this.__hooks__ = {};
	this.__object__ = obj;
}

BindableObject.prototype.get = function(name) {
	return this.__object__[name];
};

BindableObject.prototype.set = function(name, value) {
	this.__object__[name] = value;
	this.__hooks__[name].forEach(function(func) {
		func(value);
	});
};

BindableObject.register = function(model, name, hook) {
	model.__hooks__[name].push(hook);
	hook(model.__object__[name]);
};

BindableObject.defineProperty = function(model, key) {
	model.__hooks__[key] = [];
	Object.defineProperty(model, key, {
		enumerable: true,
		get: BindableObject.prototype.get.bind(this, key),
		set: BindableObject.prototype.set.bind(this, key)
	});
};

function Path(path) {
	this.path = path;
	this.parts = this.path.split('.');
	this.name = this.parts.slice(-1);
}

Path.prototype.getTarget = function(model) {
	var target = model;
	this.parts.slice(0, -1).forEach(function(item) {
		target = target[item];
	});
	return target;
};

Path.get = function(path) {
	return new Path(path);
}

function wrap(obj) {
	if (obj.__object__) {
		return obj;
	}

	var model;
	if (obj && typeof obj == 'object') {
		model = new BindableObject(obj);
		Object.keys(obj).forEach(function(key) {
			var value = obj[key];
			if (value && typeof value == 'object') {
				model[key] = wrap(value);
			} else {
				BindableObject.defineProperty(model, key);
			}
		});
	}
	return model;
}

var BindingHandler = new oop.Class(Handler, {
	handleNew: function(metaclass, name, base, dict) {
		dict.bind = function(name, model, path) {
			var self = this;
			if (!model.__object__) {
				throw new Error('model must be wraped');
			}

			path = Path.get(path);
			var target = path.getTarget(model);

			BindableObject.register(target, path.name, function(value) {
				self.node[name] = value;
			});

			S.one(self.node).on('input', function() {
				target.set(path.name, self.node.value);
			});
		}
	}
});

return {
	BindingHandler: BindingHandler,
	wrap: wrap
}

}, {
	requires: ['gallery/oop/0.1/index', '../handler']
});
KISSY.add('gallery/oui/0.2/schemas/promise',function(S, Promise) {

/*
定义：
var load = promise(function(api, callback) {
	ajax(api, function(result) {
		callback(result);
	});
});
使用：
load('api', funciton(result) {});
load('api').then(function(result) {});
 */
function promise(func) {
    return function() {
        var deferred = new Promise.Defer();
        var args = Array.prototype.slice.call(arguments, 0);
        args.push(deferred.resolve.bind(deferred));
        func.apply(this, args);
        return deferred.promise;
    }
}

return {
	promise: promise
}

}, {
	requires: ['promise']
})
KISSY.add('gallery/oui/0.2/schemas/time',function(S, oop) {

var Class = oop.Class;

/**
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @decorator
 */
function throttle(wait) {
    return function(func) {
        var context, args, timeout, throttling, more, result;
        var whenDone = debounce(function(){ more = throttling = false; }, wait);
        return function() {
            context = this;
            args = arguments;
            var later = function() {
                timeout = null;
                if (more) {
                    result = func.apply(context, args);
                }
                whenDone();
            };
            if (!timeout) timeout = setTimeout(later, wait);
            if (throttling) {
                more = true;
            } else {
                throttling = true;
                result = func.apply(context, args);
            }
            whenDone();
            return result;
        };
    };
};
 
/*
* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
* @decorator
*/
function debounce(wait, immediate) {
    return function(func) {
        var timeout, result;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };
};

function interval(time, immediate) {
    return function(func) {
        var member = function() {
            var obj = this, args = arguments;
            if (immediate) {
                func.apply(this, arguments);
            }
            member.timer = setInterval(function() {
                func.apply(obj, args);
            }, member.time);
        };
        member.time = time;
        member.stop = function() {
            clearInterval(member.timer);
        };
        return member;
    }
}

function randomInterval(min, max) {
    if (!max) {
        min = 0;
        max = min;
    }
    return function(func) {
        var member = function() {
            // 禁止重复调用产生多个timer
            if (member.timer) {
                return;
            }
            var context = this;
            var args = arguments;
            var time = Math.floor(Math.random() * (member.time[1] - member.time[0]) + member.time[0]);
            member.timer = setTimeout(function() {
                func.apply(context, args);
                member.stop();
                member.apply(context, args);
            }, time);
        };
        member.time = [min, max];
        member.stop = function() {
            clearTimeout(member.timer);
            member.timer = null;
        };
        return member;
    }
}

var DelayActivator = new Class({
    __actived: null,
    __activeMode: 0,
    __activations: {},
    enableActiveMode: true,
    active: function(func, id) {
        var self = this;

        var activation;
        if (id) {
            if (typeof id == 'object') {
                activation = id.activation || {};
                id.activation = activation;
            } else {
                activation = self.__activations[id] || {};
                self.__activations[id] = activation;
            }
        } else {
            activation = {};
        }
        activation.active = func;
        self.__actived = activation;

        function active() {
            activation.active();
            activation.activeTimer = null;
            if (self.enableActiveMode) {
                self.__activeMode++;
            }
        }

        if (activation.deactiveTimer) {
            self.stopDeactive();
        } else if (self.__activeMode) {
            active();
        } else {
            activation.activeTimer = setTimeout(active, self.activeWait);
        }
    },
    deactive: function(func) {
        var self = this;

        var activation = self.__actived;
        activation.deactive = func;

        function deactive() {
            activation.deactive();
            activation.deactiveTimer = null;
            if (self.enableActiveMode) {
                self.__activeMode--;
            }
        }

        if (activation.activeTimer) {
            self.stopActive();
        } else if (self.deactiveWait) {
            activation.deactiveTimer = setTimeout(deactive, self.deactiveWait);
        } else {
            deactive();
        }
    },
    hold: function() {
        var self = this;
        self.stopDeactive();
    },
    release: function() {
        var self = this;
        var activation = self.__actived;
        self.deactive(activation.deactive);
    },
    stopActive: function() {
        var self = this;
        var activation = self.__actived;
        clearTimeout(activation.activeTimer);
        activation.activeTimer = null;
    },
    stopDeactive: function() {
        var self = this;
        var activation = self.__actived;
        clearTimeout(activation.deactiveTimer);
        activation.deactiveTimer = null;
    },
    activate: function(wait) {
        var self = this;
        self.activeWait = wait;
        return function(func) {
            return function(id) { 
                var context = this;
                var args = arguments;
                self.active(function() {
                    func.apply(context, args);
                }, id);
            }
        }
    },
    deactivate: function(wait) {
        var self = this;

        var func;

        function _deactivate() {
            var context = this;
            var args = arguments;
            self.deactive(function() {
                func.apply(context, args);
            });
        }

        if (typeof wait == 'function') {
            func = wait;
            return _deactivate;
        } else {
            self.deactiveWait = wait;
            return function(f) {
                func = f;
                return _deactivate;
            }
        }
    }
});

return {
	throttle: throttle,
	debounce: debounce,
    interval: interval,
    randomInterval: randomInterval,
    DelayActivator: DelayActivator
}

}, {
    requires: ['gallery/oop/0.1/index']
});
KISSY.add('gallery/oui/0.2/schemas/data',function(S, oop, Handler, binding, promise, time, IO, Mustache) {

var Class = oop.Class;

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function data(options) {
    options = options || {};
    var prop = {};
    prop.__class__ = oop.property;
    prop.writable = true;
    prop.uitype = arguments.callee;
    Object.keys(options).forEach(function(key) {
        prop[key] = options[key];
    });
    if (prop.value) {
        prop.value = binding.wrap(prop.value);
    }
    return prop;
}

var DataHandler = new Class(Handler, {
    handleMember: function(cls, name, member) {
        if (!(member && member.__class__ == oop.property && member.uitype == data)) return;

        var meta = cls.meta;
        if (!meta.data) {
            meta.data = [];
        }
        if (!~meta.data.indexOf(name)) {
            meta.data.push(name);
        }

        var methodName = 'load' + capitalize(name);

        var func = function(data, callback) {
            var config = {
                url: member.api,
                jsonp: member.jsonp,
                type: member.method,
                dataType: member.dataType,
                scriptCharset: member.scriptCharset,
                data: Mustache.to_html(member.data, data),
                success: callback
            };
            IO(config);
        }

        if (member.debounce) {
            func = time.debounce(member.debounce, member.immediate)(func);
        }

        if (member.throttle) {
            func = time.throttle(member.throttle)(func);
        }

        cls.__setattr__(methodName, promise.promise(func));
    },
    handleInstance: function(component) {
        ;(component.meta.data || []).forEach(function(name) {
            var member = component.__properties__[name];
            var model = component[name];
            if (member.bind) {
                Object.keys(member.bind).forEach(function(name) {
                    component.bind(name, model, member.bind[name]);
                });
            }
        });
    }

});

return {
    data: data,
    DataHandler: DataHandler
}

}, {
    requires: ['gallery/oop/0.1/index', '../handler', './binding', './promise', './time', 'ajax', 'brix/gallery/mu/index']
});
KISSY.add('gallery/oui/0.2/Handler',function(S, oop) {

var Class = oop.Class;

var Handler = new Class({
	handleNew: function(metaclass, name, base, dict) {},
    handleMeta: function(meta) {},
    handleMember: function(cls, name, member) {},
    handleInitialize: function(cls) {},
    handleInstance: function(component) {}
});

return Handler;

}, {
    requires: ['gallery/oop/0.1/index']
})
KISSY.add('gallery/oui/0.2/schemas/template',function(S, oop, promise, Handler, dom, Mustache) {

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
		renderShadow: function(component) {
			var self = this;
			var shadow, nodes, placehoders;
			var template = self.getTemplate(component.meta);
			var temp;
			var result;
			if (template) {
				shadow = document.createDocumentFragment();
	        	result = Mustache.to_html(template, getTemplateData(component));
				S.all(result).appendTo(shadow);
				placeholders = S.all('content', shadow);
				placeholders.each(function(placeholder) {
					var selector = '> ' + (placeholder.attr('select') || '*');
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
				component.node.appendChild(shadow);
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

KISSY.add('gallery/oui/0.2/schemas/events',function(S, oop, Handler, accessors, event) {

var Class = oop.Class;

var BindEventHandler = new Class(Handler, {
    handleNew: function(metaclass, name, base, dict) {
        dict.meta.bindEvents = [];
    },
    handleMember: function(cls, name, member) {
        if (!name.match(/^on(.*)/)) return;
        
        cls.meta.bindEvents.push({
            name: RegExp.$1.toLowerCase(),
            method: name
        });
    },
    handleInstance: function(component) {
        component.meta.bindEvents.forEach(function(item) {
            S.one(component.node).on(item.name, component[item.method].bind(component));
        });
    }
});

var SubEventHandler = new Class(Handler, {
    handleNew: function(metaclass, name, base, dict) {
        dict.meta.subEvents = [];
    },
    handleMember: function(cls, name, member) {
        if (name.match(/^(.+)_on(.+)$/)) {
            cls.meta.subEvents.push({
                sub: RegExp.$1,
                name: RegExp.$2.toLowerCase(),
                method: name
            });
        }
    },
    handleInstance: function(component) {
        var meta = component.meta;
        var subEvents = [].concat(component.meta.subEvents);
        var defines = [].concat(meta.define || []).concat(meta.define1 || []).concat(meta.parent || []);
        defines.forEach(function(name) {
            var member = component.__properties__[name];
            if (member && member.bind) {
                Object.keys(member.bind).forEach(function(eventName) {
                    var expressions = member.bind[eventName].split(/\s*,\s*/);
                    subEvents.push({
                        sub: name,
                        name: eventName,
                        func: function(event) {
                            var self = this;
                            expressions.forEach(function(expression) {
                                var match = expression.match(/^(.*?)(?:\((.*)\))?$/);
                                var methodName = match[1];
                                var argName = match[2];
                                var args = [];
                                if (argName) {
                                    if (argName == '$event') {
                                        args.push(event);
                                    } else if (argName == '$target') {
                                        args.push(event.target);
                                    }
                                }
                                component[methodName].apply(self, args);
                            });
                        }
                    });
                });
            }
        });

        subEvents.forEach(function(item) {
            var member = component.__properties__[item.sub];
            var selector = member.selector;
            // can't delegate event
            if (~['blur', 'valuechange'].indexOf(item.name)) {
                event.on(selector, item.name, function(event) {
                    if (item.method) {
                        component[item.method](event);
                    } else if (item.func) {
                        item.func.call(component, event);
                    }
                }, component.node);
            } else {
                event.delegate(component.node, item.name, selector, function(event) {
                    if (item.method) {
                        component[item.method](event);
                    } else if (item.func) {
                        item.func.call(component, event);
                    }
                });
            }
        });
    }
});

return {
	BindEventHandler: BindEventHandler,
	SubEventHandler: SubEventHandler
}

}, {
	requires: ['gallery/oop/0.1/index', '../handler', './accessors', 'event']
});
KISSY.add('gallery/oui/0.2/schemas/register',function(S, oop, Handler) {

	var customTags = {};

	var RegisterHandler = new oop.Class(Handler, {
		handleInitialize: function(cls) {
			var tag = (cls.meta.namespace || 'x') + '-' + cls.meta.tag;
			if (cls.meta.tag) {
				customTags[tag] = cls;
				document.createElement(tag);
			}
		}
	});

	function bootstrap(context) {
	    Object.keys(customTags).forEach(function(tag) {
	        S.all(tag, context).each(function(node) {
	        	var tag = node.nodeName();
	        	var cls = customTags[tag];
	        	new cls(node);
	        });
	    });
	}

	/**
	 * create a custom element
	 */
	function create(tagName) {
		var cls = customTags[tagName];
		if (!cls) {
			throw new Error(tagName + ' not registed');
		}
		var meta = cls.meta;
		var baseTag = meta.baseTag;
		var tag = (meta.namespace || 'x') + '-' + meta.tag;
		var node;
		if (baseTag) {
			node = S.one('<' + baseTag + 'is="' + tag + '" />')[0];
		} else {
			node = S.one('<' + tag + '/>')[0];
		}
		new cls(node);
		return node;
	}

	return {
		customTags: customTags,
		RegisterHandler: RegisterHandler,
		bootstrap: bootstrap,
		create: create
	};

}, {
	requires: ['gallery/oop/0.1/index', '../Handler']
});

KISSY.add('gallery/oui/0.2/schemas/factory',function(S, oop, Handler, data, accessors, options) {

var Class = oop.Class;

var FactoryHandler = new Class(Handler, {
	mergeMeta: function(cls, meta) {
		Object.keys(meta).forEach(function(name) {
			cls.meta[name] = meta[name];
		});
		return cls.meta;
	},
	handleMember: function(cls, name, member) {
		if (name == '__meta') {
			this.handleMeta(cls, member);
		} else if (name == '__factory') {
			this.handleFactory(cls, member);
		}
	},
	handleInstance: function(component) {
		var options = component.__factory;
		if (!options) return;

		Object.keys(options).forEach(function(key) {
			if (key == 'meta') return;
			var value = options[key];
			component.setOption(key, value);
		});
	},
	handleMeta: function(cls, meta) {
		var self = this;
		meta = self.mergeMeta(cls, meta);
	},
	handleFactory: function(cls, factory) {
		var meta = this.mergeMeta(cls, factory.meta);

		if (meta.data) {
			meta.data.forEach(function(name) {
				cls.__setattr__(name, data.data());
			});
		}
		if (meta.define) {
			meta.define.forEach(function(name) {
				cls.__setattr__(name, accessors.define());
			});
		}
		if (meta.define1) {
			meta.define1.forEach(function(name) {
				cls.__setattr__(name, accessors.define1());
			});
		}
		if (meta.parent) {
			meta.parent.forEach(function(name) {
				cls.__setattr__(name, accessors.parent());
			});
		}
		if (meta.options) {
			meta.options.forEach(function(name) {
				cls.__setattr__(name, options.option());
			});
		}
	}
});

return {
	FactoryHandler: FactoryHandler
}

}, {
	requires: [
		'gallery/oop/0.1/index',
		'../handler',
		'./data',
		'./accessors',
		'./options'
	]
});
KISSY.add('gallery/oui/0.2/schemas/keyboard',function(S, oop, promiseSchema) {

function keycode(codes) {
    var result;
    if (typeof codes == 'number') {
        codes = [codes];
    }
    return function(func) {
        result = promiseSchema.promise(function(event, callback) {
            if (~result.keyCodes.indexOf(event.keyCode)) {
                func.apply(this, arguments);
            } else if (callback) {
                callback();
            }
        });
        result.keyCodes = codes;
        return result;
    }
}

return {
	keycode: keycode
}

}, {
	requires: ['gallery/oop/0.1/index', './promise']
})
KISSY.add('gallery/oui/0.2/index',function(S, event, Node, oop, options, accessors, dataSchema, template, events, promise, register, factory, time, keyboard, binding) {

var Class = oop.Class;

var ComponentMeta = new Class(oop.Type, {
    __new__: function(metaclass, name, base, dict) {
        var meta = dict.meta || {};
        var uses, handlers;

        dict.__mixins__ = [EventTarget];

        uses = dict.uses || base.uses || [
            factory.FactoryHandler,
            options.OptionsHandler,
            events.BindEventHandler,
            events.SubEventHandler,
            dataSchema.DataHandler,
            template.TemplateHandler,
            register.RegisterHandler,
            binding.BindingHandler
        ];
        handlers = [];
        uses.forEach(function(Handler) {
            handlers.push(new Handler());
        });
        dict.handlers = handlers;

        dict.meta = meta;
        dict.__constructed = false;

        handlers.forEach(function(handler) {
            handler.handleNew(metaclass, name, base, dict);
        });

        return oop.Type.__new__(metaclass, name, base, dict);
    },
    initialize: function(name, base, dict) {
        var cls = this;
        cls.__constructed = true;
        if (cls.handlers) {
            Object.keys(dict).forEach(function(name) {
                var member = dict[name];
                cls.handlers.forEach(function(handler) {
                    handler.handleMember(cls, name, member);
                })
            });
            cls.handlers.forEach(function(handler) {
                handler.handleInitialize(cls);
            });
        }
    },
    __setattr__: function(name, member) {
        var cls = this;
        oop.Type.prototype.__setattr__.call(cls, name, member);
        if (cls.__constructed && cls.handlers) {
            cls.handlers.forEach(function(handler) {
                handler.handleMember(cls, name, member);
            });
        }
    }
});

function EventTarget() {
}

EventTarget.prototype = event.Target;

var Component = new Class({
    __metaclass__ : ComponentMeta,
    initialize: function(node) {
        var self = this;

    	var wrapped = Node(node);
    	node = wrapped[0];

        if (node.component) {
            if (node.component.__class__ === self.__class__) {
                return node.component;
            }
            if (!(self instanceof node.component.__class__)) {
                throw new Error('node has already wraped');
            }
        }

        var meta = self.meta;
        var newNode;
        if (meta.baseTag && meta.baseTag != node.nodeName.toLowerCase()) {
            newNode = S.one('<' + meta.baseTag + ' is="' + meta.tag + '" />');
            S.each(node.attributes, function(attr) {
                newNode.attr(attr.name, attr.value);
            });
            wrapped.children().appendTo(newNode);
            wrapped.replaceWith(newNode);
            node = newNode[0];
        }

        self.node = node;
        self.node.component = self;

        self.handlers.forEach(function(handler) {
            handler.handleInstance(self);
        });

        S.one(self.node).fireHandler('created');
    }
});

function bootstrap(context) {
    register.bootstrap(context);
}

(function() {
	var originOne = Node.one;
	S.one = Node.one = function(component) {
        var args = Array.prototype.slice.call(arguments, 0);
        if (component && component.node) {
            args[0] = component.node;
        }
        var result = originOne.apply(this, args);
        if (result && result[0]) {
            wrap(result[0]);
        }
        return result;
    }
})();

function wrap(node) {
    var cls;
    if (node.component) {
        return node.component;
    } else if (node.nodeName) {
        cls = register.customTags[node.nodeName.toLowerCase()] || Component;
        return new cls(node);
    } else {
        return node;
    }
}

var schemas = {
    options: options,
    accessors: accessors,
    data: dataSchema,
    template: template,
    events: events,
    promise: promise,
    register: register,
    factory: factory,
    time: time,
    keyboard: keyboard,
    binding: binding
}

accessors.bind(wrap);

var exports = {};

exports.Component = Component;
exports.option = options.option;
exports.define1 = accessors.define1;
exports.define = accessors.define;
exports.parent = accessors.parent;
exports.data = dataSchema.data;
exports.schemas = schemas;
exports.bootstrap = bootstrap;
exports.wrap = wrap;

return exports;

}, {
	requires: [
    'event',
    'node',
    'gallery/oop/0.1/index',
    './schemas/options',
    './schemas/accessors',
    './schemas/data',
    './schemas/template',
    './schemas/events',
    './schemas/promise',
    './schemas/register',
    './schemas/factory',
    './schemas/time',
    './schemas/keyboard',
    './schemas/binding'
    ]
});
