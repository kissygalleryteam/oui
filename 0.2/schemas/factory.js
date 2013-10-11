KISSY.add(function(S, oop, Handler, data, accessors, options) {

var Class = oop.Class;

var FactoryHandler = new Class(Handler, {
	mergeMeta: function(cls, meta) {
		Object.keys(meta).forEach(function(name) {
			cls.meta[name] = meta[name];
		});
		return cls.meta;
	},
	handleMember: function(cls, name, member) {
		if (name == '__meta') {
			this.handleMeta(cls, member);
		} else if (name == '__factory') {
			this.handleFactory(cls, member);
		}
	},
	handleInitialize: function(component) {
		var options = component.__factory;
		if (!options) return;

		Object.keys(options).forEach(function(key) {
			if (key == 'meta') return;
			var value = options[key];
			component.setOption(key, value);
		});
	},
	handleMeta: function(cls, meta) {
		var self = this;
		meta = self.mergeMeta(cls, meta);
	},
	handleFactory: function(cls, factory) {
		var meta = this.mergeMeta(cls, factory.meta);

		if (meta.data) {
			meta.data.forEach(function(name) {
				cls.__setattr__(name, data.data());
			});
		}
		if (meta.define) {
			meta.define.forEach(function(name) {
				cls.__setattr__(name, accessors.define());
			});
		}
		if (meta.define1) {
			meta.define1.forEach(function(name) {
				cls.__setattr__(name, accessors.define1());
			});
		}
		if (meta.parent) {
			meta.parent.forEach(function(name) {
				cls.__setattr__(name, accessors.parent());
			});
		}
		if (meta.options) {
			meta.options.forEach(function(name) {
				cls.__setattr__(name, options.option());
			});
		}
	}
});

return {
	FactoryHandler: FactoryHandler
}

}, {
	requires: [
		'gallery/oop/0.1/index',
		'../handler',
		'./data',
		'./accessors',
		'./options'
	]
});