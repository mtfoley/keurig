const babel = require('@babel/core');
const plugin = require('./keurig-plugin');

var example1 = `
module.exports = {a:2,b:()=>{}};
`;
var example2 = `
module.exports = {};
module.exports.a = 2;
`;
const {code} = babel.transform(example2, {plugins: [plugin]});
console.log(code);
