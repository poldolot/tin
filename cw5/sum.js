'use strict';

var suma = function() {
    var suma = 0;
    for (var i = arguments.length - 1; i >= 0; i--) {
        suma += arguments[i];
    };
    return suma;
}

console.log(suma(0, 1));
console.log(suma(1, 2, 3));