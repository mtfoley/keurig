const fs = require('fs');
const symbols = require('log-symbols');
// Condition module.paths to include whichever directory we're in
module.paths.push(process.cwd());
const isClass = (func)=>{
    if(typeof func !== 'function') return false;
    const funcToString = Function.prototype.toString.call(func);
    return /^class\s/.test(funcToString);
}
const getSignature = (func)=>{
    const funcToString = Function.prototype.toString.call(func);
    const index = funcToString.indexOf('{');
    if(index > -1) return funcToString.substring(0,index);
    return func.name+'('+func.length+')';
}
class Inspect {
    constructor(file,outputDir){
        this.output = '';
        this.outputDir = outputDir;
        if(!fs.existsSync(this.outputDur)){
            console.log(`Creating Directory: ${this.outputDir}`);
            fs.mkdirSync(this.outputDir);
        }
        if(typeof file == 'string'){
            this.inspect(file);
        }
    }
    inspectClass(obj){
        this.output = `// Test For ${obj.name}\n`
                    + `before(function(done){\n\tdone();\n});\n`
                    + `describe('${obj.name}',function(){\n`;
        let _class = new obj();
        let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(_class));
        let fields = Object.getOwnPropertyNames(_class);
        methods.forEach(name=>{
            let signature = getSignature(_class[name]);
            if(name == 'constructor') signature = "constructor()";
            this.output+= `\tdescribe('Method ${signature}',function(){\n`
                        + `\t\tit('succeeds',function(done){done();});\n`
                        +`\t});\n`;
        });
        fields.forEach(name=>{
            this.output+= `\tdescribe('Field ${name}',function(){\n`
                        + `\t\tit('exists',function(done){done();});\n`
                        + `\t});\n`;
        });
        this.output += '\n});\nafter(function(done){\n\tdone();\n});\n';
        fs.writeFileSync(this.outputDir+'/'+`${obj.name}.test.js`,this.output);
    }
    inspect(file){
        const _exports = require(file);
        console.log(`Creating Tests for: ${Object.keys(_exports)}`);
        if(isClass(_exports)) this.inspectClass(_exports);
        else {
            for (const prop in _exports){
                if(isClass(_exports[prop])) this.inspectClass(_exports[prop]);
            }
        }
        console.log(`${symbols.success} Done!`);
    }
}
module.exports = {Inspect};