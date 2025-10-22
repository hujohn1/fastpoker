import Deck from './cards.js'
import Player from './player.js'
const Status = {
        "NEWROUND": {transitions: ["WAITING"]},
        "WAITING": {transitions: ["END", "PREFLOP"]},
        "PREFLOP": {transitions: ["FLOP"]}, 
        "FLOP": {transitions: ["TURN"]}, 
        "TURN": {transitions: ["RIVER"]}, 
        "RIVER": {transitions: ["NEWROUND", "END"]}, 
}
class Game{
    constructor(players){
        this.gamedeck = new Deck()
        this.gamedeck.shuffle()
        this.players = players
    }
    //get a handle to a deck object
    deal(){
        const communCards = []
        for(const p of this.players){
            for(let i=0; i<3; i++){
                p.hand.push(this.gamedeck.deck.pop())
            }
        }
        for(let i=0; i<3; i++){
            communCards.push(this.gamedeck.deck.pop())
        }
        for(const cc of communCards){
            console.log(cc.rank + "" + cc.suit)
        }
        console.log(this.gamedeck.deck.length)
        console.log('Dealt cards')
    }
}

let cpu = new Player()
let you = new Player()
let g = new Game([cpu, you])
g.deal()
