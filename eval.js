const fs=require('fs')

/*
fs.readFile('poker/LUT.txt', 'utf8', (err, data)=>{
    if(err) throw err
    console.log(data.length)
})*/
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('poker/LUT.txt')
});

lineReader.on('line', function (line) {
    const cols = line.split(" ")
    console.log('Line from file:', cols[cols.length-1]);
});

lineReader.on('close', function () {
    console.log('');
});

const evaluation=(hand)=>{
    let [heartSum, diamondSum, clubSum, spadeSum] = [0, 0, 0, 0]
    heartSum = hand.filter(x=> x=='H').length
    diamondSum = hand.filter(x=> x=='D').lengths
    spadeSum = hand.filter(x=> x=='S').length
    clubSum = hand.filter(x=> x=='C').length
    console.log(heartSum);

    let Flushes = []
    let Unique5 = []
}

evaluation(['H', 'D', 'S'])