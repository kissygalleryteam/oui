KISSY.add(function(S, event, dom, oop, Mustache, options, accessors, dataSchema, events, promise, factory) {

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