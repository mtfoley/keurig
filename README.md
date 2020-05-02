## Keurig

This is a NodeJS module intended to be installed globally and its purpose is to scaffold Javascript test files. The name is inspired by [Mocha](https://github.com/mochajs/mocha). This might already exist, but I have not gone looking for it!

## Install
1) Install globally from NPM:

`npm install -g @mtfoley/keurig`

## Usage
The tool accepts one or two command line arguments. The first is the file you want to create tests for. If the 2nd argument is not specified, test files are created in the same directory.

`keurig classFile.js [testsDirectory]`

For example, if working in a directory that has file called `testClass.js`:
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
        describe('Method constructor()',function(){
            it('succeeds',function(done){done();});
        });
        describe('Method method1()',function(){
            it('succeeds',function(done){done();});
        });
        describe('Method method2(x,y)',function(){
            it('succeeds',function(done){done();});
        });
        describe('Field field1',function(){
            it('exists',function(done){done();});
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
        describe('Method constructor()',function(){
            it('succeeds',function(done){done();});
        });
        describe('Method method3(x,y,z)',function(){
            it('succeeds',function(done){done();});
        });
        describe('Field field1',function(){
            it('exists',function(done){done();});
        });
        describe('Field field2',function(){
            it('exists',function(done){done();});
        });
    after(function(done){
        done();
    });
```