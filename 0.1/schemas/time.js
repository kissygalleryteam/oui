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

function interval(time) {
    return function(func) {
        var member = function() {
            member.timer = setInterval(S.bind(func, this), member.time);
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
    __signal: false,
    __actived: false,
    __activeTimer: null,
    __deactiveTimer: null,
    wait: 0,
    active: function(func) {
        var self = this;
        clearTimeout(self.__deactiveTimer);
        self.__deactiveTimer = null;

        if (self.__actived) {
            func();
        } else {
            self.__signal = true;
            self.__activeTimer = setTimeout(function() {
                if (self.__signal) {
                    func();
                    self.__actived = true;
                }
                self.__activeTimer = null;
            }, self.activeWait);
        }
    },
    deactive: function(func) {
        var self = this;
        clearTimeout(self.__activeTimer);
        self.__activeTimer = null;

        self.__signal = false;
        self.__deactiveTimer = setTimeout(function() {
            if (!self.__signal) {
                func();
                self.__actived = false;
            }
            self.__deactiveTimer = null;
        }, self.deactiveWait);
    },
    activate: function(wait) {
        var self = this;
        self.activeWait = wait;
        return function(func) {
            return function() {
                var context = this;
                var args = arguments;
                self.active(function() {
                    func.apply(context, args);
                });
            }
        }
    },
    deactivate: function(wait) {
        var self = this;
        self.deactiveWait = wait;
        return function(func) {
            return function() {
                var context = this;
                var args = arguments;
                self.deactive(function() {
                    func.apply(context, args);
                });
            }
        }
    },
    hold: function() {
        var self = this;
        return function() {
            if (!self.__signal) {
                self.__signal = true;
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
    requires: ['../../oop/index']
});