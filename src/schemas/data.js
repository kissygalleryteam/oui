KISSY.add(function(S, oop, Handler, promise, time, IO, Mustache) {

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