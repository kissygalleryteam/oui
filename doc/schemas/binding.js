KISSY.add(function(S, oop, Handler) {

function BindableObject(obj) {
	this.__hooks__ = {};
	this.__object__ = obj;
}

BindableObject.prototype.get = function(name) {
	return this.__object__[name];
};

BindableObject.prototype.set = function(name, value) {
	this.__object__[name] = value;
	this.__hooks__[name].forEach(function(func) {
		func(value);
	});
};

BindableObject.register = function(model, name, hook) {
	model.__hooks__[name].push(hook);
	hook(model.__object__[name]);
};

BindableObject.defineProperty = function(model, key) {
	model.__hooks__[key] = [];
	Object.defineProperty(model, key, {
		enumerable: true,
		get: BindableObject.prototype.get.bind(this, key),
		set: BindableObject.prototype.set.bind(this, key)
	});
};

function Path(path) {
	this.path = path;
	this.parts = this.path.split('.');
	this.name = this.parts.slice(-1);
}

Path.prototype.getTarget = function(model) {
	var target = model;
	this.parts.slice(0, -1).forEach(function(item) {
		target = target[item];
	});
	return target;
};

Path.get = function(path) {
	return new Path(path);
}

function wrap(obj) {
	if (obj.__object__) {
		return obj;
	}

	var model;
	if (obj && typeof obj == 'object') {
		model = new BindableObject(obj);
		Object.keys(obj).forEach(function(key) {
			var value = obj[key];
			if (value && typeof value == 'object') {
				model[key] = wrap(value);
			} else {
				BindableObject.defineProperty(model, key);
			}
		});
	}
	return model;
}

var BindingHandler = new oop.Class(Handler, {
	handleNew: function(metaclass, name, base, dict) {
		dict.bind = function(name, model, path) {
			var self = this;
			if (!model.__object__) {
				throw new Error('model must be wraped');
			}

			path = Path.get(path);
			var target = path.getTarget(model);

			BindableObject.register(target, path.name, function(value) {
				self.node[name] = value;
			});

			S.one(self.node).on('input', function() {
				target.set(path.name, self.node.value);
			});
		}
	}
});

return {
	BindingHandler: BindingHandler,
	wrap: wrap
}

}, {
	requires: ['kg/oop/0.1/index', '../handler']
});