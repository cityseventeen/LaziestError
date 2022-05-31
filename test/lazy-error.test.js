/* global Promise, describe, it, __dirname, process*/
const {expect, assert} = require('chai');
const util = require('util');

const LazyError = require(`../src/index.js`);

const t = {};
Object.freeze(t);


describe('LazyError', () => {
  describe('istanza e configurazione', () => {
    it('istanza è un proxy', () => {
      const errors = new LazyError(TypeError);
      expect(errors).to.satisfy((val)=>{return util.types.isProxy(val);});
    });
    it('new LazyError è istanza di LazyError', () => {
      const errors = new LazyError(TypeError);
      expect(errors).to.be.an.instanceOf(LazyError);
    });
    for(let tipo of [undefined, 'stringa', 1, 0, true, false, -8]){
      it.skip(`type_error senza constructor = ${tipo} restituisce errore`, () => {
        expect(()=>{new LazyError(tipo);}).to.throw(TypeError, /deve avere un constructor/);
      });
    }
    for(let cb of [0, -7, [], [1,2,3], 'stringa', {}, {a:1}]){
      it('callback <> funzione = ${cb} restituisce errore', () => {
        expect(()=>{new LazyError(TypeError, cb);}).to.throw(TypeError, /deve essere una funzione/);
      });
    }
    it('call error not previously setted throws error', () => {
      const errors = new LazyError(TypeError);
      expect(()=>{errors.not_setted();}).to.throw('error not_setted is not setted');
    });
    it('error without value doesnt throw error', () => {
      const errors = new LazyError(TypeError);
      errors.error1 = 'message';
      expect(()=>{errors.error1();}).to.not.throw();
    });
  });
  describe('assegnazione errori', () => {
    let errors;
    beforeEach(()=>{
      errors = new LazyError(TypeError);
    });
    it('errors.nome =striga con nome già esistente restituisce false', () => {
      errors.nome = 'stringa';
      expect(()=>{errors.nome = 'stringa';}).to.throw('The error name is already setted');
    });
    it('get errors.nome restituisce una funzione', () => {
      errors.nome = 'stringa';
      expect(errors.nome).to.be.a('function');
    });
    it('errors.nome(valore) restituisce una istanza di type_error definito nel costruttore', () => {
      errors.nome = 'stringa';
      expect(errors.nome('valore')).to.be.an.instanceof(TypeError).that.deep.include({message: 'stringa. Received valore string'});
    });
    it('errors.nome(valore, altro valore) restituisce una istanza di type_error definito nel costruttore', () => {
      errors.nome = 'stringa';
      expect(errors.nome('valore', 'altro valore')).to.be.an.instanceof(TypeError).that.deep.include({message: 'stringa. Received valore string, altro valore string'});
    });
    it('new errors.nome(valore) restitisce istanza di TypeError', () => {
      errors.nome = 'stringa';
      let istanza;
      expect(()=>{istanza = new errors.nome('valore');}).to.not.throw();
      expect(istanza).to.be.an.instanceof(TypeError).that.deep.include({message: 'stringa. Received valore string'});
    });
    it.skip('errors.nome = valore diverso da stringa', () => {
      /// potrebbe aver senso se usato con una callback personalizzata. non voglio limitare il suo utilizzo
    });
  });
  describe('callback personalizzata', () => {
    const type_error = TypeError;
    it('callback che non considera messaggio errore e accetta un solo valore', () => {
      const callback = (type_error, messaggio, valore)=>{return new type_error(`custom ${valore}`);};
      const errors = new LazyError(type_error, callback);
      errors.name = 'stringa di errore che non verrà considerata dalla callback';
      expect(errors.name('valore')).to.be.an.instanceof(type_error).that.deep.include({message: 'custom valore'});
    });
    it('callback che non considera messaggio e accetta più valori', () => {
      const callback = (type_error, messaggio, valore, ...args)=>{return new type_error(`custom ${valore} e ancora ${args[0]}`);};
      const errors = new LazyError(type_error, callback);
      errors.name = 'stringa di errore che non verrà considerata dalla callback';
      expect(errors.name('valore', 'secondo')).to.be.an.instanceof(type_error).that.deep.include({message: 'custom valore e ancora secondo'});
    });
  });
  describe('message property', () => {
    let errors;
    beforeEach(()=>{
      errors = new LazyError(TypeError);
    });
    it('to set a message implies the storing message in instance', () => {
      errors.errore1 = 'messaggio di errore';
      console.dir(errors.message);
      expect(errors.message.errore1).to.eql('messaggio di errore');
    });
  });
  describe('message as instance of error', () => {
    let errors;
    beforeEach(()=>{
      errors = new LazyError(TypeError);
    });
    it('message as new Error(message) return the same instance with `message. Received ${value}', () => {
      errors.error1 = new Error('message');
      let error1 = errors.error1('value');
      expect(error1).to.be.an.instanceOf(Error);
      expect(error1.message).to.eql('message. Received value string');
    });
  });
  
});
