KISSY.add(function(S, oop, Handler, accessors, event) {

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