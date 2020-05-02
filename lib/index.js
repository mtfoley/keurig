const {Inspect} = require('./inspect');
const symbols = require('log-symbols');

module.exports = {
    inspect:function(){
        if(process.argv.length > 2){
            let dir = "./";
            if(process.argv.length > 3) dir = process.argv[3];
            const ins = new Inspect(process.argv[2],dir);
        } else {
            console.log(`${symbols.error} ERROR: No File Specified!\nUsage: keurig file.js [testsDirectory]\ne.g. keurig MyClass.js ./tests`);
        }
    }
}
