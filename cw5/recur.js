'use strict';

var cached = function(cache, fun) {
    if (!fun) return false;

    var recurency = function myself (n) {
        var a = cache[n] !== undefined ? cache[n] : null;
        if (a !== null) {
            return a;
        }
        cache[n] = fun(myself, n);
        return cache[n];
    }

    return recurency;
}

var fibonacci = cached([0, 1], function (recur, n) {
    return recur(n - 1) + recur(n - 2);
});

var factorial = cached([1], function (recur, n) {
    return recur(n - 1) *n;
});

// console.log('factorial dla 5: ' + factorial(5));
// console.log('factorial dla 8: ' + factorial(8));
// console.log('fibonacci dla 7: ' + fibonacci(7));
// console.log('fibonacci dla 8: ' + fibonacci(8));
// console.log('fibonacci dla 40: ' + fibonacci(40));
// console.log('fibonacci dla 60: ' + fibonacci(60));
