KISSY.add(function(S, oop, ui, json) {

	var keyboard = ui.schemas.keyboard;

	var SearchSuggests = new oop.Class(ui.Component, {

		__factory: json,

        load: function(key, callback) {
            var self = this;

            if (key) {
                self.loadData({key: key}).then(function(data) {
                    // 避免请求回来后内容已变化，出现不匹配提示
                    // if (key != self.get('input').val()) {
                    //     return;
                    // }
                    data.key = key;
                    data.hasMore = data.total > self.get('suggestsMax');
                    self.render('options', data).then(function() {
                        self.get('options').show();
                        callback();
                    });
                });
            }
        },

        unload: function() {
            this.set('activedOption', null);
        },

		handleUpKey: keyboard.keycode(38)(function(event) {
            var self = this;
            event.preventDefault();

            var current = self.get('activedOption')? self.get('tipOptions').index(self.get('activedOption')) : self.get('tipOptions').length;
            var prev = self.get('tipOptions')[current - 1];
            (self.get('suggestsKeyLoop') || prev) && self.selectOption(prev);
        }),

        handleDownKey: keyboard.keycode(40)(function(event) {
            var self = this;
            event.preventDefault();

            var current = self.get('activedOption')? self.get('tipOptions').index(self.get('activedOption')) : -1;
            var next = self.get('tipOptions')[current + 1];
            (self.get('suggestsKeyLoop') || next) && self.selectOption(next);
        }),

    	handleEnterKey: keyboard.keycode([13, 108])(function(event) {
            var self = this;
    		if (self.get('activedOption')) {
                // active 才 handle，普通回车触发表单提交
                event.preventDefault();
    			self.get('activedOption').one('a').fire('click');
    		}
    	}),

        selectOption: function(node) {
            var self = this;
            node = S.one(node);
            // node 可能是某个内置元素
            if (!~self.get('tipOptions').index(node)) {
                self.get('tipOptions').each(function(option) {
                    if (option.contains(node)) {
                        node = option;
                        return false;
                    }
                });
            }
            this.set('activedOption', node);
        }

	});

	return SearchSuggests;

}, {
	requires: [
		'gallery/oop/0.1/index',
		'gallery/oui/0.1/index',
		'./component.json',
		'./options.mustache'
	]
});