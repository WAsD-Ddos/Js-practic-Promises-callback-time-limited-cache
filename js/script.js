"use strict"


 function processArray(arr, callback){
     return arr.map(callback);
 }
 console.log(processArray([1, 2, 3], x => x * 2)); // [2, 4, 6]
 console.log(processArray([], x => x));

 function delay(ms){
    return new Promise(resolve => setTimeout(resolve ,ms));
 }

 delay(1220).then(() => console.log("Тест пройден"));

//  function helloWor(){
//     return console.log( "hello worldsss");  test
//  }
// delay(1000).then(helloWor);


//task 3

function  randomInRange(min, max){
    const chance = new Chance();
    return chance.integer({min,max});
    
}
console.log(randomInRange(5, 10));

//task 4

const promises = [
   () => delay(100).then(() => 1),
   () => delay(200).then(() => 2)
];

function sequencePromises(promiseFunctions){
    return promiseFunctions.reduce((chain, promiseFn) => {
        return chain.then(results => 
            promiseFn().then(result => [...results, result])
        );
    }, Promise.resolve([]));
}

console.log(sequencePromises(promises));

//task 4 more easy

async function runSequentially(promiseFunctions){
    for (const promiseFn of promiseFunctions) {
        let results = await promiseFn();
        console.log(results);
    }
}

const tasks = [
  () => delay(500).then(() => "Первый"),
  () => delay(700).then(() => "Второй")
];

console.log(runSequentially(tasks));

//task 5 class TimeLimitedCache

class TimeLimitedCache{

    #cleanExpired(){
        const now = Date.now();
        for(const [key , {expires}] of this.cache){
            if(expires <= now) this.cache.delete(key);
        }
    }
    
    constructor(){ this.cache = new Map() };
    
    

    set(key, value, duration){
        const expires = Date.now() + duration;
        const existing = this.cache.get(key);
        if(existing) clearTimeout(existing.timeout);
        const timeout = setTimeout(() => this.cache.delete(key),duration);
        this.cache.set(key , {value , timeout, expires});
        return Boolean(existing);
    }

    get(key){
        let entry = this.cache.get(key);
        if(!entry) return undefined;
        
        if(Date.now() > entry.expires) {
            clearTimeout(entry.timeout);
            this.cache.delete(key); 
            return undefined;
        }
        
        return entry.value;
    }

    size(){
        this.#cleanExpired();
        return this.cache.size;
    }

    has(){
        this.#cleanExpired();
        return this.cache.has(key);
    }
}

// const cache = new TimeLimitedCache();

// console.log(cache.set('name','Alice', 1000)); // false (новый ключ)
// console.log(cache.get('name')); // 'Alice'

// setTimeout(() => {
//     console.log(cache.get('name')); // undefined (удалилось)
// }, 994);

//task 6 

async function asyncProcessArray(arr, asyncCallback, done){
     let result = [];
     for (const element of arr) {
        result.push(await asyncCallback(element));
     }
     done(result);
}
//task 7



function generateRandomUser(country = 'us'){
    const chance = new Chance();
    return{
       name: chance.name(), 
       email: chance.email(),
       age: chance.age(),
       address: chance.address({country})
    };
}

console.log(generateRandomUser('us'));
//task 8 new metods in class TimeLimitedCache such as: has(),size()


const cache = new TimeLimitedCache();
cache.set('key', 'value', 1000);
cache.size(); // 1
// cache.has('key'); // true

//task 9 Promise with timeout

function advancedDelay(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
}




function promiseWithTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Таймаут: превышено время ${timeoutMs}мс`));
    }, timeoutMs);
  });


  return Promise.race([promise, timeoutPromise]);
}

promiseWithTimeout(advancedDelay(2000), 1000)
.catch(err => console.log(err.message));