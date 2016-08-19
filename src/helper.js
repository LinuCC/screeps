
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper');
 * mod.thing == 'a thing'; // true
 */

global.log = {
  cyan: (str)=> console.log(`<span style="color: #00BFFF">${str}</span>`),
  red: (str)=> console.log(`<span style="color: red">${str}</span>`),
  green: (str)=> console.log(`<span style="color: #aadd33">${str}</span>`),
  blue: (str)=> console.log(`<span style="color: blue">${str}</span>`),
}

module.exports = {
    randomProperty: function (obj) {
        var keys = Object.keys(obj)
        return obj[keys[ keys.length * Math.random() << 0]];
    }
};

