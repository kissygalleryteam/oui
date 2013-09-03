KISSY.add(function(S, oop, Handler, time, promise, IO, Mustache) {

var Class = oop.Class;

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

        if (options.debounce) {
            func = time.debounce(options.debounce, options.immediate)(func);
        }

        if (options.throttle) {
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
    requires: ['../../oop/index', '../handler', './time', './promise', 'ajax', 'brix/gallery/mu/index']
});