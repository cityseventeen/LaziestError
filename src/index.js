/* global Reflect */

const callbackDefault =(type_error, messaggio, valore, ...altri)=>{
  let messaggio_errore_da_ritornare = messaggio.concat('. ricevuto ', valore);
  for(let arg of altri){
    messaggio_errore_da_ritornare = messaggio_errore_da_ritornare.concat(`, ${arg}`);
  }
  return new type_error(messaggio_errore_da_ritornare);
};

class LazyError{
  #settings;
  constructor(type_error, callback=undefined){
    checkConstructor(type_error, callback);
    this.#settings = {};
    this.#settings.type = type_error;
    this.#settings.callback = callback;
    return this.#returnProxy();
  }
  #returnProxy(){
    let callback;
    if(this.#settings.callback === undefined) callback = callbackDefault;
    else callback = this.#settings.callback;
    const handler = { get: (target, prop, receiver)=>{
                                const type = this.#settings.type
                                let messaggio = Reflect.get(target, prop, receiver);
                                return function(valore, ...altri_args){
                                  return callback(type, messaggio, valore, ...altri_args)};
                              },
                      set: (target, prop, value, receiver)=>{
                            //// inserire controllo se già definito, deve restituire errore e non settare
                            console.dir(arguments);
                            Reflect.set(target, prop, value, receiver);
                            return true;
                      }
                    };
    const LazyError = comandiLazyError;
    return new Proxy(LazyError, handler);
  }
}
function checkConstructor(...args){
  //if(typeof args[0] === 'function' && args[0].) /// da fare. cercare come controllare che la funzione in arg[0] abbia un constructor
  if(!(args[1] === undefined || typeof args[1] === 'function')) throw new TypeError(`la callback deve essere una funzione. Ricevuto ${args[1]}`);
}

function comandiLazyError(){
  /* eventuali metodi che si vogliono mettere a disposizione, es come list per avere la lista di tutti gli errori*/
}


  
module.exports = LazyError;
