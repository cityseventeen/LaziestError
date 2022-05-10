# EasyError
 Permette di generare degli errori dal testo personalizzato in modo semplice e diretto, e decidere tramite callback quale tipo di errore restituire e quali modifiche al testo produrre automaticamente

# Problema che vuole risolvere
Normalmente vengono inseriti dei `throw new TypeError(message)` o `throw new Error(message)` sparsi all'interno del codice. Ma spesso il messaggio deve essere costruito al momento della chiamata dell'errore. Una possibile evoluzione sarebbe di costruire un oggetto con tutti gli errori che vogliamo usare
```js
const errors = {errore1: "messaggio1, errore2: "messaggio2"}
// e poi vengono richiamati come
throw new Error(errors.errore1)
```
Resta ancora il problema di modificare il messaggio di errore, ad esempio inserendo il valore che ha causato l'errore
```js
throw new Error(errors.errore1.concat('. ma è stato ricevuto ${valore}'))
```

EasyError vuole semplificare la generazione e l'uso degli errori, permettendo di associare fin dall'inizio il particolare tipo di errore al messaggio, e anche poter restituire un messaggio personalizzabile e dinamico.

# Come funzione EasyError
`new EasyError(tipo_di_errore, [callback])`
```js
const errors = new EasyError(TypeError)
errors.errore1 = 'messaggio'
errors.errore2 = 'altro messaggio'

// e viene chiamato in questo modo
new errors.errore1() // -> istanza di TypeError("messaggio")
new errors.errore2(valore) // -> istanza di TypeError("altro messaggio. Ricevuto ${valore}")
```

### Utilizzo di callback per rendere il messaggio dinamico
Qui un esempio e il risulato che si ottiene con questa callback
```js
const callback = (type_error, messaggio, ...args) => {
    let messaggio_da_restituire = 'Attenzione!'.concat(messaggio, ' gli argomenti erano ${...args}')
    let errore = new type_error(messaggio_da_restituire).
    return errore;
}

const errors = new EasyError(TypeError, callback);
errors.errore_argomenti = 'tutti gli argomenti devono essere validi'

// e viene usato come
throw new errors.errore_argomenti(arg1, arg2, arg3)
```
