import Deck from './cards.js'
import Player from './player.js'
import Queue from './queue.js'
import EventBroker from './eventBroker.js'

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
        this.players = players
        this.dealerIndex = 0
        this.currentStatus = 'NEWROUND'
        this.commCards = []
        this.numPlayers = players.length
        this.pot = 0
        this.eb = new EventBroker()
        this.activeQueue = new Queue()
    }
    //enqueue all active players 
    initQueue(startIndex){
        this.activeQueue = new Queue()
        for (let i = 0; i < this.numPlayers; i++) {
            const idx = (startIndex + i) % this.numPlayers;
            if (this.players[idx].status === 'ACTIVE') {
                this.activeQueue.enqueue(this.players[idx]);
            }
        }
    }
    

    startRound(){
        this.gamedeck.shuffle() //reshuffle
        this.pot = 0
        this.dealerIndex = (this.dealerIndex + 1) % this.numPlayers //shift dealer
        for(const p of this.players){
            this.eb.subscribe('')
        }
        if(this.players.length == 2){
            this.players[this.dealerIndex].status = 'SMALLBLIND'
            this.players[this.dealerIndex+1].status = 'BIGBLIND'
        }
        else if(this.numPlayers > 1){
            this.players[(this.dealerIndex) % this.numPlayers].status  = 'DEALER'
            this.players[(this.dealerIndex+1) % this.numPlayers].status = 'SMALLBLIND'
            this.players[(this.dealerIndex+2) % this.numPlayers].status = 'BIGBLIND'
        }
        
    }
    startPreflop(){
        this.pot += smallBlind + bigBlind
        this.initQueue((this.dealerIndex+2)%this.numPlayers)
        this.askNextPlayer()
    }

    dealFlop(){
        this.initQueue((this.dealerIndex+1)%this.numPlayers)
        for(let i=0; i<this.numPlayers; i++){ //deal 2 cards to each player
            for(let j=0; j<2; j++){
                this.players[(this.dealerIndex+1+i)%this.numPlayers].hand.push(this.gamedeck.deck.pop())
            }
        }
        for(let i=0; i<3; i++){ //deal 3 hole cards
            this.commCards.push(this.gamedeck.deck.pop())
        }
        
    }
    dealTurn(){
        this.initQueue((this.dealerIndex+1)%this.numPlayers)
        this.commCards.push(this.gamedeck.deck.pop()) //deal the 4th card        
    }
    dealRiver(){
        this.initQueue((this.dealerIndex+1)%this.numPlayers)
        this.commCards.push(this.gamedeck.deck.pop()) //deal the 5th card
    }
    endRound(){
        this.initQueue((this.dealerIndex+1)%this.numPlayers)
        //evaluate the hands of remaining players
    }
    onBet(player, amount){
        this.pot += amount
        this.eb.sendMessage('betPlaced', {amount: amount, playerId: player.id})
    }
    askNextPlayer(){
        if(this.activeQueue.isEmpty()){
            eventBroker
            return;
        }           
        const player = this.activeQueue.dequeue()
        this.eb.sendMessage('yourTurn', {playerId: player.id})
    }
}

let cpu = new Player('CPU1', 'ACTIVE', 1000)
let you = new Player('P1', 'ACTIVE', 1000)
let g = new Game([cpu, you])
g.deal()
