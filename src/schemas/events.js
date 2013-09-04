KISSY.add(function(S, oop, Handler, accessors, event) {

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