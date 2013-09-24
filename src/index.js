KISSY.add(function(S, event, dom, oop, Mustache, options, accessors, dataSchema, template, events, promise, register, factory, time, keyboard) {

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
        if (cls.handlers) {
            cls.handlers.forEach(function(handler) {
                handler.handleInitialize2(cls);
            })
        }
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

    uses: [
        options.OptionsHandler,
        events.BindEventHandler,
        events.SubEventHandler,
        dataSchema.DataHandler,
        template.TemplateHandler,
        register.RegisterHandler,
        factory.FactoryHandler
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
    'dom',
    'gallery/oop/0.1/index',
    'brix/gallery/mu/index',
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