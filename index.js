const colors = require('colors');
const number  = typeof +process.argv.slice(2) === "number" ? +process.argv.slice(2) : 0;
const simpleArr = [];

fr: for(let i = 0; i <= number; i++){
    for (let j = 2; j < i; j++) {
        if (i % j == 0) continue fr;
    }

    simpleArr.push(i)
}

for(let i = 0, k = 1; i < simpleArr.length; i++){
    if(k === 1){
        k = 2;
        console.log(colors.green(simpleArr[i]))
    }
    else if(k === 2){
        k = 3;
        console.log(colors.red(simpleArr[i]))
    }
    else{
        k = 1;
        console.log(colors.blue(simpleArr[i]))
    }
}