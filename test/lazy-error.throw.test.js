const {expect, assert} = require('chai');
const util = require('util');

const LazyError = require(`../src/index.js`);


describe(`functionality throw Error`, function (){
    let errors;
    beforeEach(function(){
        errors = new LazyError(Error);
        errors.errore1 = 'messaggio errore 1';
        errors.errore2 = 'messaggio errore 2';
        errors.errore3 = new TypeError('messaggio errore 3 che è typeerror');
    });
    it(`throwIf exist and is a function`, function (){
        expect(errors.throwIf).to.be.a('function');
    });
    it(`throwIf accepts condition boolean value and not other`, function (){
        expect(()=>{errors.throwIf('stringa')}).to.throw();
    });
    describe(`value returned by throwIf`, function (){
        it(`condition true: throwIf return object with same errors as builded by lazyerror`, function (){
            //expect(errors.throwIf(true)).to.be.an('object');
            expect(errors.throwIf(true).errore1).to.be.a('function');
            expect(errors.throwIf(true).errore2).to.be.a('function');
            expect(errors.throwIf(true).errore3).to.be.a('function');
        });
        it(`condition false: throwIf return object with same errors as builded by lazyerror`, function (){
            //expect(errors.throwIf(false)).to.be.an('object');
            expect(errors.throwIf(false).errore1).to.be.a('function');
            expect(errors.throwIf(false).errore2).to.be.a('function');
            expect(errors.throwIf(false).errore3).to.be.a('function');
        });
        it(`function in object returned throws error if condition equals true`, function (){
            expect(()=>{errors.throwIf(true).errore1('value')}).to.throw(errors.message.errore1);
            expect(()=>{errors.throwIf(true).errore2('value')}).to.throw(errors.message.errore2);
            expect(()=>{errors.throwIf(true).errore3('value')}).to.throw(errors.message.errore3);
        });
        it(`function in object returned does not throw error if condition equals false`, function (){
            expect(()=>{errors.throwIf(false).errore1('value')}).to.not.throw();
            expect(()=>{errors.throwIf(false).errore2('value')}).to.not.throw();
            expect(()=>{errors.throwIf(false).errore3('value')}).to.not.throw();
        });
    });
});
