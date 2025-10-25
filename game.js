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
const minBet = 10;
const smallBlind = minBet/2;
const bigBlind = minBet; 

class Game{
    constructor(players){
        this.gamedeck = new Deck()
        this.gamedeck.shuffle()
        this.players = players
        this.dealerIndex = 0
        this.currentStatus = 'NEWROUND'
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
    startRound(){
        //change Status to PREFLOP once check goes around that everyone is ready
        //timer module countdown before autofold
        //go around in counterclockwise order for each player
        if(this.players.length > 1){
            this.players[this.dealerIndex].status  = 'DEALER'
            this.players[this.dealerIndex+1].status = 'SMALLBLIND'
            this.players[this.dealerIndex+2].status = 'BIGBLIND'
        }
        if(this.players.length == 2){
            this.players[this.dealerIndex].status = 'SMALLBLIND'
            this.players[this.dealerIndex+1].status = 'BIGBLIND'
        }
    }
}

let cpu = new Player()
let you = new Player()
let g = new Game([cpu, you])
g.deal()
