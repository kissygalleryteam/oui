KISSY.add(function(S, oop, Handler) {

var Class = oop.Class;

function define1(selector, options) {
    var prop = oop.property(function() {
        return this.node.one(selector);
    });
    prop.uitype = arguments.callee;
    prop.selector = selector;
    prop.options = options;
    return prop;
}

function define(selector, options) {
    var prop = oop.property(function() {
        return this.node.all(selector);
    });
    prop.uitype = arguments.callee;
    prop.selector = selector;
    prop.options = options;
    return prop;
}

return {
	define1: define1,
	define: define
}

}, {
	requires: ['gallery/oop/0.1/index', '../handler']
});