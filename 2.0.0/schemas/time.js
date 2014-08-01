KISSY.add(function(S, oop) {

var Class = oop.Class;

/**
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @decorator
 */
function throttle(wait) {
    return function(func) {
        var context, args, timeout, throttling, more, result;
        var whenDone = debounce(function(){ more = throttling = false; }, wait);
        return function() {
            context = this;
            args = arguments;
            var later = function() {
                timeout = null;
                if (more) {
                    result = func.apply(context, args);
                }
                whenDone();
            };
            if (!timeout) timeout = setTimeout(later, wait);
            if (throttling) {
                more = true;
            } else {
                throttling = true;
                result = func.apply(context, args);
            }
            whenDone();
            return result;
        };
    };
};
 
/*
* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
* @decorator
*/
function debounce(wait, immediate) {
    return function(func) {
        var timeout, result;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };
};

function interval(time, immediate) {
    return function(func) {
        var member = function() {
            var obj = this, args = arguments;
            if (immediate) {
                func.apply(this, arguments);
            }
            member.timer = setInterval(function() {
                func.apply(obj, args);
            }, member.time);
        };
        member.time = time;
        member.stop = function() {
            clearInterval(member.timer);
        };
        return member;
    }
}

function randomInterval(min, max) {
    if (!max) {
        min = 0;
        max = min;
    }
    return function(func) {
        var member = function() {
            // 禁止重复调用产生多个timer
            if (member.timer) {
                return;
            }
            var context = this;
            var args = arguments;
            var time = Math.floor(Math.random() * (member.time[1] - member.time[0]) + member.time[0]);
            member.timer = setTimeout(function() {
                func.apply(context, args);
                member.stop();
                member.apply(context, args);
            }, time);
        };
        member.time = [min, max];
        member.stop = function() {
            clearTimeout(member.timer);
            member.timer = null;
        };
        return member;
    }
}

var DelayActivator = new Class({
    __actived: null,
    __activeMode: 0,
    __activations: {},
    enableActiveMode: true,
    active: function(func, id) {
        var self = this;

        var activation;
        if (id) {
            if (typeof id == 'object') {
                activation = id.activation || {};
                id.activation = activation;
            } else {
                activation = self.__activations[id] || {};
                self.__activations[id] = activation;
            }
        } else {
            activation = {};
        }
        activation.active = func;
        self.__actived = activation;

        function active() {
            activation.active();
            activation.activeTimer = null;
            if (self.enableActiveMode) {
                self.__activeMode++;
            }
        }

        if (activation.deactiveTimer) {
            self.stopDeactive();
        } else if (self.__activeMode) {
            active();
        } else {
            activation.activeTimer = setTimeout(active, self.activeWait);
        }
    },
    deactive: function(func) {
        var self = this;

        var activation = self.__actived;
        activation.deactive = func;

        function deactive() {
            activation.deactive();
            activation.deactiveTimer = null;
            if (self.enableActiveMode) {
                self.__activeMode--;
            }
        }

        if (activation.activeTimer) {
            self.stopActive();
        } else if (self.deactiveWait) {
            activation.deactiveTimer = setTimeout(deactive, self.deactiveWait);
        } else {
            deactive();
        }
    },
    hold: function() {
        var self = this;
        self.stopDeactive();
    },
    release: function() {
        var self = this;
        var activation = self.__actived;
        self.deactive(activation.deactive);
    },
    stopActive: function() {
        var self = this;
        var activation = self.__actived;
        clearTimeout(activation.activeTimer);
        activation.activeTimer = null;
    },
    stopDeactive: function() {
        var self = this;
        var activation = self.__actived;
        clearTimeout(activation.deactiveTimer);
        activation.deactiveTimer = null;
    },
    activate: function(wait) {
        var self = this;
        self.activeWait = wait;
        return function(func) {
            return function(id) { 
                var context = this;
                var args = arguments;
                self.active(function() {
                    func.apply(context, args);
                }, id);
            }
        }
    },
    deactivate: function(wait) {
        var self = this;

        var func;

        function _deactivate() {
            var context = this;
            var args = arguments;
            self.deactive(function() {
                func.apply(context, args);
            });
        }

        if (typeof wait == 'function') {
            func = wait;
            return _deactivate;
        } else {
            self.deactiveWait = wait;
            return function(f) {
                func = f;
                return _deactivate;
            }
        }
    }
});

return {
	throttle: throttle,
	debounce: debounce,
    interval: interval,
    randomInterval: randomInterval,
    DelayActivator: DelayActivator
}

}, {
    requires: ['kg/oop/0.1/index']
});