KISSY.add(function(S, event, Node, oop, options, accessors, dataSchema, template, events, promise, register, factory, time, keyboard, binding) {

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

        S.one(self.node).fire('created');
    }
});

function bootstrap(context) {
    register.bootstrap(context);
}

(function() {
	var originOne = Node.one;
	S.one = Node.one = function(component) {
        var args = Array.prototype.slice.call(arguments, 0);
        if (component.node) {
            args[0] = component.node;
        }
        var result = originOne.apply(this, args);
        if (result[0]) {
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