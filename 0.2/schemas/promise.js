KISSY.add(function(S, Promise) {

/*
定义：
var load = promise(function(api, callback) {
	ajax(api, function(result) {
		callback(result);
	});
});
使用：
load('api', funciton(result) {});
load('api').then(function(result) {});
 */
function promise(func) {
    return function() {
        var deferred = new Promise.Defer();
        var args = Array.prototype.slice.call(arguments, 0);
        args.push(deferred.resolve.bind(deferred));
        func.apply(this, args);
        return deferred.promise;
    }
}

return {
	promise: promise
}

}, {
	requires: ['promise']
})