const symbols = require('log-symbols');
const {TestFactory} = require('./test-factory');

module.exports = {
    run:function(){
        let argv = process.argv.slice(2);
        let dir = ".";
        if(argv.length >= 2 && (argv[0] == "-d" || argv[0] == "--dir")){
            dir = argv[1];
            argv = argv.slice(2);
        }
        if(argv.length > 0){
            const files = argv;
            console.log(`${symbols.info} Directory: ${dir}`);
            const ins = new TestFactory(dir,true);
            //const files = glob.sync(process.argv[2]);
            console.log(`${symbols.info} Creating tests for ${files.length} files`);
            const promises = files.map(f => {
                return ins.run(f);
            });
            Promise.all(promises)
            .catch(error=> console.error(`${symbols.error} ${error}`))
            .then(outputs=>{
                console.log(`${symbols.success} Done!`);
                console.log(`${symbols.info} Try running mocha ${ins.outputDir}*.test.js`);
            });
        } else {
            console.log(`${symbols.error} No File Specified!\nUsage: keurig file.js [testsDirectory]\ne.g. keurig MyClass.js ./tests`);
        }
    }
}
