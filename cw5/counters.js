'use strict';

var createCounters = function(n) {
    if (!n) return false;
    var counters = [];
    for (var i = 0; i <= n; i++) {
        counters.push((
            function(k){
                return function(){return k}
            })(i));
    };
    return counters;
}

// var counters = createCounters(1000);
// console.log(counters[0]());
// console.log(counters[10]());
// console.log(counters[34]());