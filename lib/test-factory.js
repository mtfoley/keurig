const fs = require('fs');
const parser = require('@babel/parser');
const sep = require('path').sep;
const symbols = require('log-symbols');
// Utility Function getNodeBody checks AST Node for either `body` or `expression` array, checking in that order.

const getNodeBody = (n)=>{
	return n.body ? 
		(!n.body.length && n.body !== [] ?
			[n.body] : 
			n.body) 
		: n.expression ? 
			(!n.expression.length && n.expression !== [] ?
				[n.expression] :
				n.expression)
			: [];
};
const getItemName = (n)=>{
    let s = "";
    if(n && (n.id || n.key)){
        let nId = n.id;
        let nKey = n.key;
        if(nId && nId.type && nId.name && nId.type === 'Identifier') s += `${nId.name}`;
        if(nKey && nKey.type && nKey.name && nKey.type === 'Identifier') s += `${nKey.name}`;
        if(n.type == 'ClassMethod' || n.type == 'Method'){
            if(n.params){
                s += '('+n.params.map(p=> p.name).join(',')+')';
            }
        }
    }
    return s;
}
const getClassMethods = (n)=>{
    if(n.type !== 'ClassDeclaration') return null;
    let body = getNodeBody(getNodeBody(n)[0]);
    if(body.length){
        let methods = body.filter(n => n.type == 'ClassMethod' && n.kind !== 'constructor');
        return methods.map(node => getItemName(node));
    }
}
const getClassConstructor = (n)=>{
    if(n.type !== 'ClassDeclaration') return null;
    let body = getNodeBody(getNodeBody(n)[0]);
    if(body.length){
        let ctor = body.find(n => n.type == 'ClassMethod' && n.kind == 'constructor');
        return getItemName(ctor);
    }
};
// Utility Function getClassFields recursively attempts to find class fields, as declared in a constructor.
const getClassFields = (n)=>{
    // if this is a class declaration, change `n` to point to constructor method.
    if(n.type == 'ClassDeclaration'){
        let body = getNodeBody(getNodeBody(n)[0]);
        if(body.length){
            n = body.find(n => n.type == 'ClassMethod' && n.kind == 'constructor');
        }    
    }
    if(!n || !n.type) return [];
    const digDeeper = ['ClassMethod','BlockStatement','ExpressionStatement','AssignmentExpression'];
	const matchesFn = (n)=>{
		return n.left && n.left.type  && n.left.type == 'MemberExpression';
	}
    let matches = [];
	if(digDeeper.includes(n.type)){
        let body = getNodeBody(n);
		body.forEach(c => {
			matches = matches.concat(getClassFields(c));
		});
	};
    if(matchesFn(n) === true) return n.left.property.name;
	return matches;
}
const getClassModel = (n)=>{
    if(!n || !n.type) return null;
    if(n.type !== 'ClassDeclaration') return null;
    let model = {name:'',ctor:'',fields:[],methods:[]};
    model.name = getItemName(n);
    model.ctor = getClassConstructor(n);
    model.fields = getClassFields(n);
    model.methods = getClassMethods(n);
    return model;
}
const getTestOutput = (n)=>{
    let model = getClassModel(n);
    let output = "";
    if(model){
        output += `before(function(done){
    done();
});\n`;
        output += `describe("${model.name}",function(){`;
        if(model.ctor !== ''){
            output += `
    describe("${model.ctor}",function(){
        it("succeeds",function(done){
            // assert.ok(1);
            done();
        })`;
            model.fields.forEach(field =>{
                output += `
        it("has field ${field}",function(done){
            // assert.ok(1);
            done();
        })`
            });

        }
        output += `
    });`;
        model.methods.forEach(method => {
            output += `
    describe("${method}",function(){
        it("succeeds",function(done){
            // assert.ok(1);
            done();
        });
    })\n`
        });
        output += `})\n`;
        output += `after(function(done){
    done();
});\n`;
        return {name:model.name,content:output};
    }
    return {name:'',content:''};
}

class TestFactory {
    constructor(outputDir,debug){
        if(!outputDir || outputDir == "") outputDir = "."+sep;
        this.outputDir = outputDir;
        if(this.outputDir[this.outputDir.length-1] !== sep) this.outputDir += sep;
        this.debug = (debug === true);
        if(this.debug) console.log(`${symbols.success} TestFactory Created`);
        fs.lstat(this.outputDir,(err,stats)=>{
            if(err || !stats.isDirectory()){
                if(this.debug) console.log(`${symbols.info} Creating Output Directory ${this.outputDir}`)
                fs.mkdirSync(this.outputDir);
            }
        });
    }
    run(file){
        return new Promise((resolve,reject)=>{
            if(this.debug) console.log(`${symbols.info} Running for ${file}`);
            fs.readFile(file,(err,data)=>{
                if(err){
                    if(this.debug) console.error(err);
                    resolve(err);
                } else {
                    try {
                        let content = data.toString();
                        let ast = parser.parse(content,{plugins:['classProperties']});
                        if(ast.program){
                            let classNodes = ast.program.body.filter(n => n.type =='ClassDeclaration');
                            console.log(`${symbols.success} Found ${classNodes.length} Classes in File ${file}`)
                            classNodes.forEach(classNode=>{
                                let {name,content} = getTestOutput(classNode);
                                if(content !== ''){
                                    const filePath = `${this.outputDir}${name}.test.js`;
                                    if(this.debug) console.log(`${symbols.info} Writing Test File ${filePath}...`);
                                    fs.writeFile(filePath,content,(err)=>{
                                        if(err) console.error(err);
                                    });
                                }  else {
                                    console.log(`${symbols.error} No Test Output Generated`);
                                } 
                            });
                            console.log(`${symbols.success} Ran for file: ${file}`);
                            resolve(file);
                        } else {
                            console.log(`${symbols.error} Program Not Found By AST`);
                            resolve(`${symbols.error} Program Not Found By AST`);
                        }
                    } catch(err){
                        if(this.debug) console.error(`${symbols.error} Parsing Error with file ${file}: ${err}`);
                        resolve(err);
                    }    
                }
            }); 
        });
    }
}
module.exports = {TestFactory};