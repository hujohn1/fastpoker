import fs from 'fs'
import readline from 'readline'
import {Card} from './cards.js'
/*
fs.readFile('poker/LUT.txt', 'utf8', (err, data)=>{
    if(err) throw err
    console.log(data.length)
})*/
let Flushes = []
let Unique5 = []
let map = new Map()

const fileStream = fs.createReadStream('C:/Users/johnh/Documents/CS/poker/LUT.txt');

const lineReader = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

lineReader.on('line', function (line) {
    const cols = line.trim().split(/\s+/)
    
    if(cols[cols.length-1] === 'Flush'){
        const [c1, c2, c3, c4, c5]  = [new Card('S',cols[5]), new Card('S',cols[6]), new Card('S',cols[7]), new Card('S',cols[8]), new Card('S',cols[9])]
        let value  = (c1.bits | c2.bits | c3.bits | c4.bits | c5.bits) >> 16
        Flushes[value] = cols[0]
    }
    let isStraight = cols[cols.length-1] === 'Straight' || cols[cols.length-2] === 'Straight'
    let isHigh = cols[cols.length-1].split('-')[1] === 'High' || cols[cols.length-2].split('-')[1] === 'High' || cols[cols.length-3].split('-')[1] === 'High'
    if(isStraight || isHigh){
        //console.log(line)
        const [c1, c2, c3, c4, c5]  = [new Card('S',cols[5]), new Card('S',cols[6]), new Card('S',cols[7]), new Card('S',cols[8]), new Card('S',cols[9])]
        let value  = (c1.bits | c2.bits | c3.bits | c4.bits | c5.bits) >> 16
        Unique5[value] = cols[0]
    }
    else{
        const [c1, c2, c3, c4, c5]  = [new Card('S',cols[5]), new Card('S',cols[6]), new Card('S',cols[7]), new Card('S',cols[8]), new Card('S',cols[9])]
        let pproduct = (c1.bits & 0xFF) * (c2.bits & 0xFF) * (c3.bits & 0xFF) * (c4.bits & 0xFF) * (c5.bits & 0xFF)
        map.set(pproduct, parseInt(cols[0]))
    }
    //console.log('Line from file:', cols[cols.length-1]);
});

lineReader.on('close', function () {
    //console.log(Flushes[6405])
    //console.log(Unique5[4615])
    //console.log(map.get(21021))
    const hand = [
        new Card('S', '2'),
        new Card('S', '3'),
        new Card('S', '4'),
        new Card('S', '5'),
        new Card('S', '6')
    ];
    const hand2 = [
        new Card('S', 'A'),
        new Card('S', 'Q'),
        new Card('S', 'K'),
        new Card('S', 'J'),
        new Card('S', 'T')
    ];
    console.log(evaluation(hand))
    console.log(evaluation(hand2))
});

const isFlush=(hand)=>{
    return (hand[0].bits & hand[1].bits & hand[2].bits & hand[3].bits & hand[4].bits)
}
const evaluation=(hand)=>{
    let value = (hand[0].bits | hand[1].bits | hand[2].bits | hand[3].bits | hand[4].bits) >> 16
    if(isFlush(hand)){
        console.log("Flush")
        if(Flushes[value]!= undefined){return Flushes[value]}
    }
    if(Unique5[value]!=undefined){
        console.log('High/Straight')
        return Unique5[value]
    }
    else{
        let pproduct = (hand[0].bits & 0xFF) * (hand[1].bits & 0xFF) * (hand[2].bits & 0xFF) * (hand[3].bits & 0xFF) * (hand[4].bits & 0xFF)
        return map.get(pproduct)
    }
}

