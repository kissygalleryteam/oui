KISSY.add(function(S, oop, Handler) {

function option(value) {
	var p = oop.property(function() {
		return this.getOption(p.__name__) || value;
	}, function(value) {
		this.setOption(p.__name__, value);
	});
	p.uitype = arguments.callee;
	return p;
}

var OptionsHandler = new oop.Class(Handler, {
	handleNew: function(metaclass, name, base, dict) {
		dict.getOption = this.getOption;
		dict.setOption = this.setOption;
	},
	setOption: function(name, value) {
		self['__' + name] = value;
	},
	getOption: function(name) {
		return self['__' + name];
	}
});

return {
	option: option,
	OptionsHandler: OptionsHandler
}

}, {
	requires: ['../../oop/index', '../handler']
});