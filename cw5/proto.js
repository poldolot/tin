'use strict';

String.prototype.deogonkify = function() {
    var replaceMap = {'Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ż':'Z','Ź':'Z','ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ż':'z','ź':'z'}
    return this.replace(/[ĄĆĘŁŃÓŚŻŹąćęłńóśżź]/g, function(a){return replaceMap[a]||a})
};

var test = new String('Zażółć gęślą jaźń');
console.log(test.deogonkify());