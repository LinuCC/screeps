modwide.log = {
  cyan: (str)=> console.log(`<span style="color: #00BFFF">${str}</span>`),
  red: (str)=> console.log(`<span style="color: red">${str}</span>`),
  green: (str)=> console.log(`<span style="color: #aadd33">${str}</span>`),
  blue: (str)=> console.log(`<span style="color: blue">${str}</span>`),
  orange: (str)=> console.log(`<span style="color: orange">${str}</span>`),
}

module.exports = {
    randomProperty: function (obj) {
        let keys = Object.keys(obj)
        return obj[keys[ keys.length * Math.random() << 0]];
    },
    encodeCoordinate: function(pos) {
        return String.fromCodePoint(pos.x | (pos.y << 6));
    },
    decodeCoordinate: function(string, index) {
        let val = string.charCodeAt(index);
        let x = (val &  0x3F);
        let y = ((val >> 6) & 0x3F);
        return {x: x, y:y};
    }
};

