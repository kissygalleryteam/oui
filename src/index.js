KISSY.add(function(S, event, oop, options, accessors, dataSchema, template, events, promise, register, factory, time, keyboard) {

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

var Component = new Class(HTMLElement, {

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
        var self = this;

        if (node) {
            var wrapped;

            // compatible for kissy node
            if (node.constructor == S.Node) {
                wrapped = node;
                node = node[0];
            } else {
                wrapped = S.one(node);
            }

            node = oop.inject(node, this.__class__);

            if (node.component) {
                throw new Error('node has already wraped');
            }

            node._node = node;
            node.node = wrapped;
            node._node.component = node;

            node.handlers.forEach(function(handler) {
                handler.handleInstance(node);
            });

            return node;
        }
    }

});

function bootstrap(context) {
    schemas.register.bootstrap(context);
}

(function() {
    var _create = document.createElement;
    document.createElement = function(tagName) {
        var node;
        if (tagName.indexOf('-') != -1) {
            node = register.create(tagName);
        } else {
            node = _create.apply(document, arguments);
        }

        return node;
    }
})();

var exports = {};

exports.Component = Component;
exports.option = options.option;
exports.define1 = accessors.define1;
exports.define = accessors.define;
exports.parent = accessors.parent;
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