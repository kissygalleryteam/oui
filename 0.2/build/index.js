/*
combined files : 

gallery/oui/0.2/handler
gallery/oui/0.2/schemas/options
gallery/oui/0.2/schemas/accessors
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
    handleInitialize: function(component) {},
    handleInitialize2: function(cls) {}
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
					member[subName] = subValue;
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
			value = type(self.node.attr(name));
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

var Class = oop.Class;

function define(selector, options) {
    options = options || {};

    var prop = oop.property(function() {
        var method = prop.method || 'all';
        var node = this.node[method](prop.selector);
        // TODO
        if (method == 'one' && node && node[0].component) {
            return node[0].component;
        }
        return node;
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
    parent: parent
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

function interval(time) {
    return function(func) {
        var member = function() {
            member.timer = setInterval(S.bind(func, this), member.time);
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
            return function() {
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
KISSY.add('gallery/oui/0.2/schemas/data',function(S, oop, Handler, promise, time, IO, Mustache) {

var Class = oop.Class;

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function data(options) {
    options = options || {};
    var prop = oop.property(function() {
        return this['_' + prop.__name__];
    }, function(value) {
        this['_' + prop.__name__] = value;
    });
    prop.uitype = arguments.callee;
    Object.keys(options).forEach(function(key) {
        prop[key] = options[key];
    });
    return prop;
}

var DataHandler = new Class(Handler, {
    handleMember: function(cls, name, member) {
        if (!(member && member.__class__ == oop.property && member.uitype == data)) return;

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
    }
});

return {
    data: data,
    DataHandler: DataHandler
}

}, {
    requires: ['gallery/oop/0.1/index', '../handler', './promise', './time', 'ajax', 'brix/gallery/mu/index']
});
KISSY.add('gallery/oui/0.2/Handler',function(S, oop) {

var Class = oop.Class;

var Handler = new Class({
	handleNew: function(metaclass, name, base, dict) {},
    handleMeta: function(meta) {},
    handleMember: function(cls, name, member) {},
    handleInitialize: function(component) {},
    handleInitialize2: function(cls) {}
});

return Handler;

}, {
    requires: ['gallery/oop/0.1/index']
})
KISSY.add('gallery/oui/0.2/schemas/template',function(S, oop, promise, Handler, dom, Mustache) {

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
			if (template) {
				shadow = document.createDocumentFragment();
				S.all(template).appendTo(shadow);
				placeholders = S.all(shadow.querySelectorAll('content'));
				placeholders.each(function(placeholder) {
					var selector = placeholder.attr('select') || '*';
					var targets = component.node.all(selector);
					if (!targets.length) {
						targets = placeholder.children();
					}
					placeholder.replaceWith(targets);
				});
			}
			if (shadow) {
				component.node.html('');
				component.node.append(shadow);
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
            name: RegExp.$1,
            method: name
        });
    },
    handleInitialize: function(component) {
        component.meta.bindEvents.forEach(function(item) {
            component.node.on(item.name, component[item.method].bind(component));
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
                name: RegExp.$2,
                method: name
            });
        }
    },
    handleInitialize: function(component) {
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
	        	var newNode;
	        	var name = node.nodeName();
	        	var baseTag = cls.meta.baseTag;
	        	if (baseTag && baseTag != name) {
	        		newNode = S.one('<' + baseTag + ' is="' + name + '" />');
	        		S.each(node[0].attributes, function(attr) {
	        			newNode.attr(attr.name, attr.value);
	        		});
	        		node.children().appendTo(newNode);
	        		node.replaceWith(newNode);
	        		node = newNode;
	        	}
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
	handleInitialize: function(component) {
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
KISSY.add('gallery/oui/0.2/index',function(S, event, oop, options, accessors, dataSchema, template, events, promise, register, factory, time, keyboard) {

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
    keyboard: keyboard
}

var Class = oop.Class;

var ComponentMeta = new Class(oop.Type, {
    __new__: function(metaclass, name, base, dict) {
        var meta = dict.meta || {};
        var handlers;

        if (dict.uses) {
            handlers = [];
            dict.uses.forEach(function(Handler) {
                handlers.push(new Handler());
            });
            dict.handlers = handlers;
        } else {
            handlers = base.handlers;
        }

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
                handler.handleInitialize2(cls);
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

    __mixins__: [EventTarget],

    uses: [
        factory.FactoryHandler,
        options.OptionsHandler,
        events.BindEventHandler,
        events.SubEventHandler,
        dataSchema.DataHandler,
        template.TemplateHandler,
        register.RegisterHandler
    ],

    initialize : function(node) {
        if (!node) {
            throw new Error('bad argument, component must wrap a node');
        }

        var wrapped;

        // compatible for kissy node
        if (node.constructor == S.Node) {
            wrapped = node;
            node = node[0];
        } else {
            wrapped = S.one(node);
        }

        if (node.component) {
            throw new Error('node has already wraped');
        }

        this._node = node;
        this.node = wrapped;
        this._node.component = this;

        this.handlers.forEach(function(handler) {
            handler.handleInitialize(this);
        }, this);
    }

});

function bootstrap(context) {
    schemas.register.bootstrap(context);
}

var exports = {};

exports.Component = Component;
exports.option = options.option;
exports.define1 = accessors.define1;
exports.define = accessors.define;
exports.data = dataSchema.data;
exports.schemas = schemas;
exports.bootstrap = bootstrap;

return exports;

}, {
	requires: [
    'event',
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
    './schemas/keyboard'
    ]
});
