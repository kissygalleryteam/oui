KISSY.add(function(S, oop, Handler) {

var Class = oop.Class;

function define(selector, options) {
    options = options || {};

    var prop = oop.property(function() {
        var method = prop.method || 'all';
        var node = this[method](prop.selector);
        if (prop.method == 'one' && node[0].component) {
            node = node[0].component;
        }
        return node;
    });
    prop.uitype = arguments.callee;
    prop.selector = selector;
    Object.keys(options).forEach(function(key) {
        prop[key] = options[key];
    });
    return prop;
}

function define1(selector, options) {
    options = options || {};
    options.method = 'one';

    return define(selector, options);
}

function parent(selector, options) {
    options = options || {};
    options.method = 'parent';

    return define(selector, options);
}

return {
	define1: define1,
	define: define,
    parent: parent
}

}, {
	requires: ['gallery/oop/0.1/index', '../handler']
});