KISSY.add(function(S, oop, Handler, data, accessors) {

var Class = oop.Class;

var FactoryHandler = new Class(Handler, {
	handleMember: function(cls, name, member) {
		if (name != '__factory') return;
		var meta = member.meta;
		if (meta.data) {
			meta.data.forEach(function(name) {
				cls.__setattr__(name, data.data(member[name]));
			});
		}
		if (meta.define) {
			meta.define.forEach(function(name) {
				cls.__setattr__(name, accessors.define(member[name].selector, member[name]));
			});
		}
		if (meta.define1) {
			meta.define1.forEach(function(name) {
				cls.__setattr__(name, accessors.define1(member[name].selector, member[name]));
			});
		}
		if (meta.option) {
			meta.option.forEach(function(name) {
				cls.__setattr__(name, options.option(member[name]));
			});
		}
	},
	handleInitialize: function(component) {
		var options = component.__factory;
		if (!options) return;
	}
});

return {
	FactoryHandler: FactoryHandler
}

}, {
	requires: [
		'../../oop/index',
		'../handler',
		'./data',
		'./accessors'
	]
});