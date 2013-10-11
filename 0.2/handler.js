KISSY.add(function(S, oop) {

var Class = oop.Class;

var Handler = new Class({
	handleNew: function(metaclass, name, base, dict) {},
    handleMeta: function(meta) {},
    handleMember: function(cls, name, member) {},
    handleInitialize: function(component) {},
    handleInitialize2: function(cls) {}
});

return Handler;

}, {
    requires: ['gallery/oop/0.1/index']
})