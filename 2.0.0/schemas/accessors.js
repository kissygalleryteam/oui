KISSY.add(function(S, oop, Handler) {

var wrap;

var Class = oop.Class;

function define(selector, options) {
    options = options || {};

    var prop = oop.property(function() {
        var method = prop.method || 'all';
        var node = S.one(this.node)[method](prop.selector);

        if (method == 'parent' || method == 'one') {
            return wrap(node[0]);
        } else if (method == 'all') {
            var arr = [];
            node.each(function(item) {
                arr.push(wrap(item[0]));
            });
            return arr;
        }
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
    parent: parent,
    bind: function(func) {
        wrap = func;
    }
}

}, {
	requires: ['kg/oop/0.1/index', '../handler']
});