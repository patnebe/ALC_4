/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable no-console */
//console.log('Hello World');
//console.log('show');

//Task 1: Write the following basic functions
let add = (a, b) => {
	return a + b;
};

let sub = (a, b) => {
	return a - b;
};

let mul = (a, b) => {
	return a*b;
};


//Task 2: Write a function identityf that takes an argument and returns a function that returns that argument
let identityf = (args) => {
    return () => args;
};


//Task 3: Write a function addf that adds from two invocations
let addf = (x) => {
    let a = x; //apparently the function will still work if I skip this step
    return (y) => a + y;//so I could just replace a with x here since this function will be able to access x
};


//Task 4: Write a binary function liftf that takes a binary function, and makes it callable with two invocations
let liftf = (binFunc) => {
    return (x) => {return (y) => binFunc(x,y);};
};


//Task 5: Write a function curry that takes a binary function and an argument, and returns a function that can take a second argument
let curry = (binFunc, arg) => {
    return (x) => binFunc(arg, x);
};


//Task 6: Show three ways to build a new functionality (which increments a number by 1) using the above functions without writing any new function
let inc = addf(1);
// console.log(inc(5), inc(inc(5)));

let inc2 = liftf(add)(1);
// console.log(inc2(5), inc2(inc2(5)));

let inc3 = curry(add, 1);
// console.log(inc3(5), inc3(inc3(5)));
//THE CODE ABOVE ILLUSTRATES THE FIRST RULE OF FUNCTIONAL PROGRAMMIG: LET THE FUNCTIONS DO THE WORK. NO NEED TO REWRITE CODE IF THERE'S ALREADY A FUNCTION THAT CAN DO THE WORK.


//Task 7: Write a function 'twice' that takes a binary function and returns a unary function that passes its argument to the binary function twice
const twice = (binFunc) => {
    return (x) => binFunc(x, x);
};

let double = twice(add);
let square = twice(mul);
// console.log(double(11), square(11));


//Task 8: Write reverse, a function that reverses the arguments of a binary function
const reverse = (funct) => {return (x,y) => funct(y,x);};
let bus = reverse(sub);
// console.log(bus(3, 2));


//Task 9: Write a function composeu that takes two unary functions and returns a unary function that calls them both
const composeu = (func1, func2) => {
    return (x) => {return func2(func1(x));};
};
// console.log(composeu(double, square)(5));


//Task 10: Write a function composeb that takes two binary functions and returns a function that calls them both
const composeb = (funct1, funct2) => {
    return (x, y, z) => {return funct2(funct1(x,y),z);};
};

// console.log(composeb(add, mul)(2, 3, 7));


//Task 11: Write a limit function that allows a binary function to be called a limited number of times
const limit = (func, nlimit) => {
    let counter = 0;
    return (...x) => {
        if (counter < nlimit){counter+=1; return func(...x);}
        else {console.log(`You've reached the call limit for this function: ${counter}`); return undefined;}
    }; 
};
let add_ltd = limit(add, 3);
// console.log(add_ltd(3, 4));


//Task 12: Write a from function that produces a generator that will produce a series of values
const from = (x) => {
    return () => x++;
};
//let index = from(8);
//console.log(index(), index(), index());


//Task 13: Write a to function that takes a generator and an end value and returns a generator that produce numbers up that limit
const to = (gen, endVal) => {
    return () => {
        if (endVal > 1) {--endVal; return gen();}
        else {return undefined;}
    };
};
let index = to(from(1), 3);
// console.log(index(), index(), index(), index());


//Task 14: Write a fromTo function that produces a generator that will produce values in a range.
const fromTo = (startVal, endVal) => {
        return () => {if (startVal < endVal){startVal++; return startVal-1;}
        else {return undefined;}};
    };

const indices = fromTo(1, 5);
// console.log(indices(), indices(), indices());


//Task 15: Write an element function that takes an array and a generator and returns a generator that will produce elments from the array. Task 15b: then modify it to return all items in the array if gen isn't provided
const element = (array, gen) => {
    let x = 0;
    array.push(undefined);    
    return () => {
        if (gen === undefined) {x++; return array[x-1];} //Instead of manually returning each element of the array, you can simply provide a value for gen and the function will contine to work as expected i.e. if (gen === undefined) {gen = fromTo(0, array.length);}, then you proceed to return the portion below the else statement. Do this for all values gen that are not functions
        else {
            let index = gen();
            if (index !== undefined) {return array[index];} //Note 1
        } 
    };
};

//Note 1: The code will actually work most of the time even if the "if" statement is left out. However, things will break if there's actually a value called "undefined" within the array object which you pass to "element". When this happens, the value of undefined will be returned instead of "undefined" as expected.

let ele = element(['a', 'b', 'c', 'd']);
// console.log(ele(), ele(), ele(), ele(), ele());


//Task 16: Write a collect function that takes a generator and an array and produces a function that will collect the results in the array.
const collect = (gen, array) => {
    let result;
    return () => {
        result = gen();
        if (result !== undefined) {array.push(result);}
        return result;
    };
};
let array = [];
let col = collect(fromTo(0, 4), array);
// console.log(col(), col(), col(), col(), col(), col(), array);


// Task 17: Write a filter function that takes a generator and a predicate and produces a generator that produces only the  values approved by the predicate
const third = (value) => {return (value % 3) === 0;};

const filter = (gen, predicate) => {
    return () => {
        // collect(gens, array)(); console.log(array); console.log(counter);
        // if (array[counter] === undefined) {return undefined;}
        // for (counter; predicate(array[counter]) == true; counter++){}
        // counter++;
        // return array[counter-1];
        let value;
        do {value = gen();} while (value !== undefined && !predicate(value));
        return value;    
    };
};

let fil = filter(fromTo(0,5), third);
// console.log(fil(), fil(), fil(), fil());


//Task 18: Write a concat function that takes two generators and produces a generator that combines the sequences
const concat = (gen1, gen2) => {
    let gen1Val;
    let gen2Val;
    return () => {
        gen1Val = gen1();
        if (gen1Val === undefined) {gen2Val = gen2(); return gen2Val;}
        return gen1Val;
    };
};

let con = concat(fromTo(0, 3), fromTo(0,2));
// console.log(con(), con(), con(), con(), con(), con());


// Task 19: Make a function gensymf that makes a function that generates unique symbols
const gensymf = (input) => {
    // let num = 0;
    let num = from(1);
    return () => {
        // num++;
        // return input+num.toString();
        return input.toString()+num();
    };
};

let geng = gensymf('G');
let genh = gensymf('H');

// console.log(geng(), genh(), geng(), genh());


// Task 20: Make a function fibonaccif that returns a generator that will return the next fibonacci number
const fibonaccif = (x, y) => {
    let fibArray = [x, y];
    let n = 0;
    return () => {
        if (n < 2) {return fibArray[n++];}
        let length = fibArray.length;
        fibArray.push(add(fibArray[length-2], fibArray[length-1])); console.log(fibArray);
        return fibArray[length]; //The length returned here is the length before the new value was pushed to the array
    };
};

const fib = fibonaccif(9, 10);
// console.log(fib(), fib(), fib());



// NOW WE START DEALING WITH OBJECTS


// Task 21: Write a counter function that returns an object containint two functions that implement an up/down counter, hiding the counter. Constraint: Do not use 'this' or 'global' variables
const counter = (x) => {
    return {
        up: ()=>{return ++x;},
        down: ()=>{return --x;}
    };
};

let object = counter(10);
let up = object.up;
let down = object.down;

// console.log(up(), down(), down(), up());


// Task 22: Make a revocable function that takes a binary function, and returs an object containing an invoke function that con invoke the binary function, and a revoke function that disables the invoke function
const revocable = (binaryFunction) => {
    return {
        invoke: (x, y) => {
            if (binaryFunction !== undefined){return binaryFunction(x,y);} //This step is necessary because calling a revoked function throws an error
        },
        revoke: () => {binaryFunction = undefined;}
    };
};

let rev = revocable(add);
let add_rev =  rev.invoke;
// console.log(add_rev(3, 4));
// rev.revoke();
// console.log(add_rev(5, 7));

// Bonus Challenge: Write a function m that takes a value and an optional source string and returns them in an object
const m = (value, source) => {
    return {
        value: value,
        source: (typeof source === 'string') ? source : String(value)
    };
};


//Task 23: Write a function addm that takes two m objects and returns an m object
const addm = (first, second) => {
    // return {
    //     value: first.value + second.value,
    //     source: `(${first.source}+${second.source})`
    // };  //Doing it like this is the hard way
    return m(first.value+second.value, `(${first.source}+${second.source})`); //This the functional way to do it
};

// console.log(JSON.stringify(addm(m(3), m(4))));
// console.log(JSON.stringify(addm(m(1), m(Math.PI, 'pi'))));


//Task 24: Write a function liftm that takes a binary function and a string and returns a function that acts on m objects
const liftm = (binaryFunc, op) => {
    return (a, b) => {
        if (typeof(a) === 'number'){a = m(a);}
        if (typeof(b) === 'number'){b = m(b);}
        return m(
            binaryFunc(a.value, b.value), `(${a.source}${op}${b.source})`
        );
    };
};

let addmm = liftm(add, '+');
// console.log(JSON.stringify(addmm(3, 4)));


// Task 25: Write a function exp that evaluates simple array expressions
// const exp = (value) => {
//     return (Array.isArray(value)) ? value[0](
//         exp(value[1]),
//         exp(value[2])
//     ) : value;
// };

const exp = (arr) => {
    if (Array.isArray(arr)){return arr[0](exp(arr[1]), exp(arr[2]));}
    else {return arr;}
};

// let sae = [mul, 5, 11];
// console.log(exp(sae));

let nae = [
    Math.sqrt, 
    [
        add, 
        [square, 3], 
        [square, 4]]
];

// console.log(exp(nae));


// Task 26: Write a function addg that adds from many invocations, until it sees an empty invocation
let result = 0;

const addg = (first) => {
    let more = (next) => {
        if (next === undefined){return first;}
        first += next;
        return more;
    };
    if (first !== undefined){
        return more;
    }
    return undefined;   
};

// console.log(addg(), addg(2)(), addg(2)(7)(), addg(3)(0)(4)(), addg(1)(2)(4)(8)());


// Task 27: Write a function liftg that will take a binary function and apply it to many invocations
const liftg = (binaryFunc) => {
    return (x) => {
        const innerInner = (y) => {
            if (y === undefined) {return x;}
            x = binaryFunc(x, y); 
            return innerInner;};
        if (x !== undefined){return innerInner;}   
    };
    // let innerLiftG = (x) => {
    //     if (x===undefined){return undefined;}
    //     return ()=> {};answer = binaryFunc(x);
    //     return innerLiftG;
    // };
};

// console.log(liftg(mul)(), liftg(mul)(3)(), liftg(mul)(3)(0)(4)(), liftg(mul)(1)(2)(4)(8)());


// Task 28: Write a function arrayg that will build an array from many invocations
const arrayg = (element) => {
    let arr = [];
    if (element === undefined) {return arr;}
    const more = (nextElement) => {
        if (nextElement !== undefined) {arr.push(nextElement); return more;}
        return arr;
    };
    arr.push(element);
    return more;
};

// console.log(arrayg(), arrayg(3)(), arrayg(3)(4)(5)());

// Task 29: Make a function continuize that takes a unary function, and returns a function that takes a callback and an argument
const continuize = (unaryFunction) => {
    return(callback, argument) => {return callback(unaryFunction(argument));};
};

let sqrtc = continuize(Math.sqrt);
// console.log(sqrtc(console.log, 81));


//USING FUNCTIONS TO CONSTRUCT OBJECTS
// const constructor = (init) => {
//     let that = other_constructor(init);
//     let member;
//     const method = ()=> {};
//     that.method = method;
//     return that;
// };


// Task 30: Make an array wrapper object with methods get, store, and append, such that an attacker cannot get access to the private array.
const vector = () => {
    let array = [];
    return {
        get: (i)=>array[i],
        store: (i, v)=>array[i]=v,
        append: (v)=>array.push(v)
    };
};

//Tests
const myVector = vector();
myVector.append(7);
myVector.store(1, 8);
// console.log(myVector.get(0));
// console.log(myVector.get(1));

//Security attack. I'm not sure what this attack does though
let stash;
myVector.store('push', ()=>stash=this);
myVector.append();
// console.log(stash);

//Task 31: Make a function that makes a publish/subscribe object. It will reliably deliver all publications to all subscibers in the right order
const pubsub = () => {
    let subscibers = []; 
    return {
         subscribe: (subsciber)=>{subscibers.push(subsciber);}, 
         publish: (publication)=>{subscibers.forEach(x=>x(publication));}};
};