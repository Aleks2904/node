const fs = require('fs');

const lineReader = require('line-reader');
require('moment-precise-range-plugin');
const moment = require('moment');
const EE = require('events');
const [data] = process.argv.slice(2);
const PATTERN = '';

const LOG_DEAR = './log.txt';
const LOG_DEAR_FILTERS = './log-filter.txt';
const SIZE = 104857600; //100mb


const writeStream = fs.createWriteStream(LOG_DEAR, {encode: 'utf-8', flags: 'a'});
const writeStreamSort = fs.createWriteStream(LOG_DEAR_FILTERS, {encode: 'utf-8', flags: 'a'});

//генерация файла на 100мб

function rndString(){
    function RRTN(){ //returnRandomThreeNumber
        return Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    }

    return `${RRTN()}.${RRTN()}.${RRTN()}.${RRTN()} - - [25/May/2021:00:07:24 +0000] "POST /baz HTTP/1.1" 200 0 "-" "curl/7.47.0" \n`;
}

function createFileMinSize(){
    let fileSize = fs.statSync(LOG_DEAR) ? fs.statSync(LOG_DEAR).size : 0;
    if(fileSize < SIZE){
        writeStream.write(rndString(), ()=>{createFileMinSize()});
    }else {
        writeStream.close();

        //фильтр логов

        const reg = /[^1-5]\d+\.[^5-9]\d+\.\d+.\d+/g

        lineReader.eachLine(LOG_DEAR, function(reader) {
            if(reg.test(reader)){
                writeStreamSort.write(reader + '\n')
            }
        })

    }
}

writeStream.write(rndString(), createFileMinSize);


//вывод даты

const dateFormat = (date)=>{
    const [h, d, m, y] = date.split('.');
    return new Date(Date.UTC(y, m - 1, d, h));
}

const dateConclusion = (date) =>{
    const newDate = new Date();

    if(newDate >= dateFormat){
        EE.emit('end')
        console.log('отсчет закончен');
    }
    else{
        const currentDate = moment(newDate, PATTERN);
        const receivedDate = moment(date, PATTERN);
        const diff = moment.preciseDiff(currentDate, receivedDate);

        console.clear();
        console.log(diff)
    }
}

if(data){
    const emit = new EE();
    const dateFuture = dateFormat(data);
    const timer = setInterval(()=>{
        emit.emit('tick', dateFuture)
    },1000)

    emit.on('tick', dateConclusion)
    emit.on('end', ()=>{clearInterval(timer)})
}


