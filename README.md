## Keurig

This is a NodeJS module intended to be installed globally and its purpose is to scaffold Javascript test files for Javascript classes. The name is inspired by [Mocha](https://github.com/mochajs/mocha). This might already exist, but I have not gone looking for it!

It uses [@babel/parser](https://npmjs.com/package/@babel/parser) to parse the javascript files and identify Class Declarations, Class Methods, and Class Field assignments inside constructors. Based on this information, it generates test files for each class found.

## Install
1) Install globally from NPM:

`npm install -g @mtfoley/keurig`

## Usage
The tool accepts an optional outputDirectory argument. The default will be to use the current working directory. The required argument is the file or glob of files you want to create tests for.

`keurig [-d outputDirectory ] */**.js`

For example, if the target files include a file called `testClass.js`:
```javascript
    class TestClass {
        constructor(field1value){
            this.field1 = field1value;
        }
        method1(){}
        method2(x,y){}
    }
    class TestClass2 extends TestClass {
        constructor(field1value,field2value){
            super(field1value);
            this.field2 = field2value;
        }
        method3(x,y,z){}
    }
    module.exports = {TestClass,TestClass2};
```
And then running `keurig testClass.js ./tests`, the utility will create files in the ./tests directory like this for "TestClass.test.js":
```javascript
    // Test For TestClass
    before(function(done){
        done();
    });
        describe('constructor()',function(){
            it('succeeds',function(done){done();});
            it('has field field1',function(done){done();})
        });
        describe('method1()',function(){
            it('succeeds',function(done){done();});
        });
        describe('method2(x,y)',function(){
            it('succeeds',function(done){done();});
        });
    after(function(done){
        done();
    });
```
and this for TestClass2.test.js:
```javascript
    // Test For TestClass2
    before(function(done){
        done();
    });
        describe('constructor()',function(){
            it('succeeds',function(done){done();});
            it('has field field2',function(done){done();})
        });
        describe('Method method3(x,y,z)',function(){
            it('succeeds',function(done){done();});
        });
    after(function(done){
        done();
    });
```