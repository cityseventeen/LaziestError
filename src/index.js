/* global Reflect */
const util = require('util');

const callbackNoValue = (type_error, message_error)=>{
  let message;
  if(typeof message_error === 'object') message = message_error.message;
  else message = message_error;

  let messaggio_errore_da_ritornare = message;
  if(typeof message_error === 'object'){
    message_error.message = messaggio_errore_da_ritornare;
    return message_error}
  else
    return new type_error(messaggio_errore_da_ritornare);
};



const callbackDefault =(type_error, message_error, valore, ...altri)=>{
  let message;
  if(typeof message_error === 'object') message = message_error.message;
  else message = message_error;

  let value_inspect;
  if(typeof valore === 'object')
    value_inspect = util.inspect(valore, {depth: null, showHidden: false});
  else value_inspect = valore;

  message = message.concat(`. Received ${value_inspect} that is a/an ${typeof valore}`);

  let adding_value = '';
  for(let arg of altri){
    adding_value = adding_value.concat(`, ${arg} ${typeof arg}`);
  }
  let messaggio_errore_da_ritornare = message.concat(adding_value)
  if(typeof message_error === 'object'){
    message_error.message = messaggio_errore_da_ritornare;
    return message_error}
  else
    return new type_error(messaggio_errore_da_ritornare);
};

class LazyError{
  #preset_keys;
  constructor(type_error, callback=undefined){
    checkConstructor(type_error, callback);
    callback = callback===undefined?callbackDefault:callback
    
    this.settings = {};
    this.settings.type = type_error;   
    this.settings.callback = callback;
    this.messages_list = {};
    this.#preset_keys = ['message', 'messages_list', 'throwIf', 'settings'];

    return this.#returnProxy(type_error, callback, callbackNoValue);
  }
  get message(){
    return this.messages_list;
  }

  throwIf(condition){
    if(typeof condition !== 'boolean')
      throw new TypeError('condition must be boolean value');

    const lazyerror_context = this;

    const handler = { get: (target, prop, receiver)=>{
                              let error_message = lazyerror_context.messages_list[prop];
                              if(!isErrorSetted(error_message)) throw new TypeError(`B: error ${prop} is not setted`);
                              return function errorGenerator(valore, ...altri_args){
                                const error = lazyerror_context.settings.callback(lazyerror_context.settings.type, error_message, valore, ...altri_args);
                                if(condition === true) throw error;
                                else;
                              }
                    }};
    const object_list_errors_to_return = {};
    return new Proxy(object_list_errors_to_return, handler);
  }


  #returnProxy(type_error, callback, callbackNoValue){
    const handler = { get: (target, prop, receiver)=>{
                                let error_or_message = Reflect.get(target, prop, receiver);
                                if(this.#isPresetKey(prop)) return error_or_message;
                                else{
                                  if(!isErrorSetted(error_or_message)) throw new TypeError(`A: error ${prop} is not setted`);
                                  return function errorGenerator(valore, ...altri_args){
                                    return callback(type_error, error_or_message, valore, ...altri_args)};
                                }
                            },
                      set: (target, prop, value, receiver)=>{
                            this.#isAlreadySettedThrowsError(target, prop, receiver);
                            this.#addRawMessage(prop, value)
                            return Reflect.set(target, prop, value, receiver);
                      }
                    };
    
    return new Proxy(this, handler);
  }
  
  #addRawMessage(prop, message){
    this.messages_list[prop] = message;
  }
  #isPresetKey(key){
    return this.#preset_keys.indexOf(key) !== -1;
  }
  #isAlreadySettedThrowsError(target, prop, receiver){
    let previously_value = Reflect.get(target, prop, receiver);
    if(previously_value !== undefined) throw new TypeError(`The error name is already setted. Tried to set ${prop}`);
  }
}
function checkConstructor(...args){
  //if(typeof args[0] === 'function' && args[0].) /// da fare. cercare come controllare che la funzione in arg[0] abbia un constructor
  if(!(args[1] === undefined || typeof args[1] === 'function')) throw new TypeError(`la callback deve essere una funzione. Ricevuto ${args[1]}`);
}
function isErrorSetted(error){
  return error !== undefined;
}

function comandiLazyError(){
  /* eventuali metodi che si vogliono mettere a disposizione, es come list per avere la lista di tutti gli errori*/
}


  
module.exports = LazyError;
