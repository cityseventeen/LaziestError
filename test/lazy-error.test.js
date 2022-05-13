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
  });
  describe('assegnazione errori', () => {
    let errors;
    beforeEach(()=>{
      errors = new LazyError(TypeError);
    });
    it('errors.nome = stringa restituisce non false', () => {
      errors.nome = 'stringa';
      expect(errors.nome = 'stringa').to.not.be.false;
    });
    it.skip('errors.nome =striga con nome già esistente restituisce false', () => {
      //// da implementare
      errors.nome = 'stringa';
      expect(errors.nome = 'stringa').to.be.false;
    });
    it('get errors.nome restituisce una funzione', () => {
      errors.nome = 'stringa';
      expect(errors.nome).to.be.a('function');
    });
    it('errors.nome(valore) restituisce una istanza di type_error definito nel costruttore', () => {
      errors.nome = 'stringa';
      expect(errors.nome('valore')).to.be.an.instanceof(TypeError).that.deep.include({message: 'stringa. ricevuto valore'});
    });
    it('errors.nome(valore, altro valore) restituisce una istanza di type_error definito nel costruttore', () => {
      errors.nome = 'stringa';
      expect(errors.nome('valore', 'altro valore')).to.be.an.instanceof(TypeError).that.deep.include({message: 'stringa. ricevuto valore, altro valore'});
    });
    it('new errors.nome(valore) restitisce istanza di TypeError', () => {
      errors.nome = 'stringa';
      let istanza;
      expect(()=>{istanza = new errors.nome('valore');}).to.not.throw();
      expect(istanza).to.be.an.instanceof(TypeError).that.deep.include({message: 'stringa. ricevuto valore'});
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
      errors.nome = 'stringa di errore che non verrà considerata dalla callback';
      expect(errors.name('valore')).to.be.an.instanceof(type_error).that.deep.include({message: 'custom valore'});
    });
    it('callback che non considera messaggio e accetta più valori', () => {
      const callback = (type_error, messaggio, valore, ...args)=>{return new type_error(`custom ${valore} e ancora ${args[0]}`);};
      const errors = new LazyError(type_error, callback);
      errors.nome = 'stringa di errore che non verrà considerata dalla callback';
      expect(errors.name('valore', 'secondo')).to.be.an.instanceof(type_error).that.deep.include({message: 'custom valore e ancora secondo'});
    });
  });
  
});