'use strict';

var obj = {
    className: 'first bordered'
}

var addClassName = function(obj, name) {
    if (!obj || !name) return false;
    var names = obj.className.split(' '),
        dodaj = true;
    for (var i = names.length - 1; i >= 0; i--) {
        if (names[i] == name) dodaj = false;
    };
    if (dodaj) {
        names.push(name);
        obj.className = names.join(' ');
    }
    return true;
}

// addClassName(obj, 'visible');
// console.log(obj.className);
// addClassName(obj, 'visible');
// console.log(obj.className);