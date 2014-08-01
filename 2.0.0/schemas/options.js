KISSY.add(function(S, oop, Handler) {

function getMember(obj, name) {
	if (name in obj.__properties__) {
		return obj.__properties__[name];
	} else {
		return obj[name];
	}
}

function mergeOptions(p, options) {
	Object.keys(options).forEach(function(key) {
		p[key] = options[key];
	});
}

function option(value, options) {
	var p = oop.property(function() {
		return this.getOption(p.__name__) || p.defaultValue;
	}, function(value) {
		this.setOption(p.__name__, value);
	});
	p.uitype = arguments.callee;
	p.defaultValue = value;
	mergeOptions(p, options || {});
	return p;
}

var OptionsHandler = new oop.Class(Handler, {
	handleNew: function(metaclass, name, base, dict) {
		dict.getOption = this.getOption;
		dict.setOption = this.setOption;
	},
	setOption: function(name, value) {
		var self = this;

		var member = getMember(self, name);
		if (member) {
			if (value && typeof value == 'object') {
				Object.keys(value).forEach(function(subName) {
					var subValue = value[subName];
					if (subName == 'value' && member.writable) {
						self[name] = subValue;
					} else {
						member[subName] = subValue;
					}
				});
			} else {
				self['__' + name] = value;
			}
		}
	},
	getOption: function(name) {
		var self = this;

		var value;
		var member = getMember(self, name);
		var type = member.defaultValue.constructor;
		if (self['__' + name]) {
			value = type(self['__' + name]);
		} else if (member.attribute) {
			value = type(S.one(self.node).attr(name));
		}
		return value;
	}
});

return {
	option: option,
	OptionsHandler: OptionsHandler
}

}, {
	requires: ['kg/oop/0.1/index', '../handler']
});