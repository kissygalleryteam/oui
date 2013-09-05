/*
combined files : 

gallery/oui/0.1/handler
gallery/oui/0.1/schemas/options
gallery/oui/0.1/schemas/accessors
gallery/oui/0.1/schemas/promise
gallery/oui/0.1/schemas/data
gallery/oui/0.1/schemas/events
gallery/oui/0.1/schemas/factory
gallery/oui/0.1/index

*/
KISSY.add('gallery/oui/0.1/handler',function(S, oop) {

var Class = oop.Class;

var Handler = new Class({
	handleNew: function(metaclass, name, base, dict) {},
    handleMeta: function(meta) {},
    handleMember: function(cls, name, member) {},
    handleInitialize: function(cls) {}
});

return Handler;

}, {
    requires: ['../oop/index']
})
KISSY.add('gallery/oui/0.1/schemas/options',function(S, oop, Handler) {

function option(value) {
	var p = oop.property(function() {
		return this.getOption(p.__name__) || value;
	}, function(value) {
		this.setOption(p.__name__, value);
	});
	p.uitype = arguments.callee;
	return p;
}

var OptionsHandler = new oop.Class(Handler, {
	handleNew: function(metaclass, name, base, dict) {
		dict.getOption = this.getOption;
		dict.setOption = this.setOption;
	},
	setOption: function(name, value) {
		self['__' + name] = value;
	},
	getOption: function(name) {
		return self['__' + name];
	}
});

return {
	option: option,
	OptionsHandler: OptionsHandler
}

}, {
	requires: ['../../oop/index', '../handler']
});
KISSY.add('gallery/oui/0.1/schemas/accessors',function(S, oop, Handler) {

var Class = oop.Class;

function define1(selector, options) {
    var prop = oop.property(function() {
        return this.node.one(selector);
    });
    prop.uitype = arguments.callee;
    prop.selector = selector;
    prop.options = options;
    return prop;
}

function define(selector, options) {
    var prop = oop.property(function() {
        return this.node.all(selector);
    });
    prop.uitype = arguments.callee;
    prop.selector = selector;
    prop.options = options;
    return prop;
}

return {
	define1: define1,
	define: define
}

}, {
	requires: ['../../oop/index', '../handler']
});
KISSY.add('gallery/oui/0.1/schemas/promise',function(S, Promise) {

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
KISSY.add('gallery/oui/0.1/schemas/data',function(S, oop, Handler, promise, IO, Mustache) {

var Class = oop.Class;

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

var _time;
function getTimeModule() {
    if (_time) return _time;
    var key = 'components/ui/schemas/time';
    if (!~Object.keys(S.Env.mods).indexOf(key)) {
        throw 'time module not required, please add dependency: ' + key;
    } else if (!S.Env.mods[key].value) {
        throw 'time module not loaded';
    } else {
        _time = S.Env.mods[key].value;
        return _time;
    }
}

function data(options) {
    var prop = oop.property(function() {
        return this['_' + prop.__name__];
    }, function(value) {
        this['_' + prop.__name__] = value;
    });
    prop.uitype = arguments.callee;
    prop.options = options;
    return prop;
}

var DataHandler = new Class(Handler, {
    handleMember: function(cls, name, member) {
        if (!(member && member.__class__ == oop.property && member.uitype == data)) return;

        var methodName = 'load' + capitalize(name);
        var options = member.options;

        var func = function(data, callback) {
            var config = {
                url: options.api,
                jsonp: options.jsonp,
                type: options.method,
                dataType: options.dataType,
                scriptCharset: options.scriptCharset,
                data: Mustache.to_html(options.data, data),
                success: callback
            };
            IO(config);
        }

        var time;
        if (options.debounce) {
            time = getTimeModule();
            func = time.debounce(options.debounce, options.immediate)(func);
        }

        if (options.throttle) {
            time = getTimeModule();
            func = time.throttle(options.throttle)(func);
        }

        cls.__setattr__(methodName, promise.promise(func));
    }
});

return {
    data: data,
    DataHandler: DataHandler
}

}, {
    requires: ['../../oop/index', '../handler', './promise', 'ajax', 'brix/gallery/mu/index']
});
KISSY.add('gallery/oui/0.1/schemas/events',function(S, oop, Handler, accessors, event) {

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
        if (member && (member.uitype == accessors.define || member.uitype == accessors.define1) && member.options && member.options.bind) {
            Object.keys(member.options.bind).forEach(function(eventName) {
                var expressions = member.options.bind[eventName].split(/\s*,\s*/);
                cls.meta.subEvents.push({
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
                            cls.prototype[methodName].apply(self, args);
                        });
                    }
                });
            });
        }
        else if (name.match(/^(.+)_on(.+)$/)) {
            cls.meta.subEvents.push({
                sub: RegExp.$1,
                name: RegExp.$2,
                method: name
            });
        }
    },
    handleInitialize: function(component) {
        component.meta.subEvents.forEach(function(item) {
            var selector = component.__properties__[item.sub].selector;
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
	requires: ['../../oop/index', '../handler', './accessors', 'event']
});
KISSY.add('gallery/oui/0.1/schemas/factory',function(S, oop, Handler, data, accessors, options) {

var Class = oop.Class;

var FactoryHandler = new Class(Handler, {
	handleMember: function(cls, name, member) {
		if (name != '__factory') return;
		var meta = member.meta;
		if (meta.data) {
			meta.data.forEach(function(name) {
				cls.__setattr__(name, data.data(member[name]));
			});
		}
		if (meta.define) {
			meta.define.forEach(function(name) {
				cls.__setattr__(name, accessors.define(member[name].selector, member[name]));
			});
		}
		if (meta.define1) {
			meta.define1.forEach(function(name) {
				cls.__setattr__(name, accessors.define1(member[name].selector, member[name]));
			});
		}
		if (meta.options) {
			meta.options.forEach(function(name) {
				cls.__setattr__(name, options.option(member[name]));
			});
		}
	},
	handleInitialize: function(component) {
		var options = component.__factory;
		if (!options) return;
	}
});

return {
	FactoryHandler: FactoryHandler
}

}, {
	requires: [
		'../../oop/index',
		'../handler',
		'./data',
		'./accessors',
		'./options'
	]
});
KISSY.add('gallery/oui/0.1/index',function(S, event, dom, oop, Mustache, options, accessors, dataSchema, events, promise, factory) {

var Class = oop.Class;

var ComponentMeta = new Class(oop.Type, {
    __new__: function(metaclass, name, base, dict) {
        var meta = {};
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
            })
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

    uses: [options.OptionsHandler, events.BindEventHandler, events.SubEventHandler, dataSchema.DataHandler, factory.FactoryHandler],

    initialize : function(node) {
        this.node = node;
        this.handlers.forEach(function(handler) {
            handler.handleInitialize(this);
        }, this);
    },
    
    render: promise.promise(function(name, data, callback) {
        var templateNode = S.one(this.__properties__[name].options['template-from']);
        var template = templateNode.html();
        var result = Mustache.to_html(template, data);
        if (templateNode) {
            dom.insertBefore(S.one(result), templateNode);
        } else {
            this.node.append(result);
        }
        callback();
    })

});

var exports = {};

exports.Component = Component;
exports.option = options.option;
exports.define1 = accessors.define1;
exports.define = accessors.define;
exports.data = dataSchema.data;

return exports;

}, {
	requires: [
    'event',
    'dom',
    'gallery/oop/0.1/index',
    'brix/gallery/mu/index',
    './schemas/options',
    './schemas/accessors',
    './schemas/data',
    './schemas/events',
    './schemas/promise',
    './schemas/factory'
    ]
});
