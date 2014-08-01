KISSY.add(function(S, oop, promiseSchema) {

function keycode(codes) {
    var result;
    if (typeof codes == 'number') {
        codes = [codes];
    }
    return function(func) {
        result = promiseSchema.promise(function(event, callback) {
            if (~result.keyCodes.indexOf(event.keyCode)) {
                func.apply(this, arguments);
            } else if (callback) {
                callback();
            }
        });
        result.keyCodes = codes;
        return result;
    }
}

return {
	keycode: keycode
}

}, {
	requires: ['kg/oop/0.1/index', './promise']
})