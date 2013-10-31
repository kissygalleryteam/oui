KISSY.add(function(S, oop, Handler, binding, promise, time, IO, Mustache) {

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