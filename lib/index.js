const {Inspect} = require('./inspect');
module.exports = {
    inspect:function(){
        if(process.argv.length > 2){
            let dir = "./";
            if(process.argv.length > 3) dir = process.argv[3];
            const ins = new Inspect(process.argv[2],dir);
        }   
    }
}
