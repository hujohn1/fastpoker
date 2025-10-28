import {Deck} from './cards.js'
import Player from './player.js'
import Queue from './queue.js'
import EventBroker from './eventBroker.js'
import {ACTIONS, PSTATUSES, STATUSES} from './constants.js'
import {smallBlind, minBet, bigBlind} from './constants.js'

class Game{
    constructor(players, eb){
        this.gamedeck = new Deck()
        this.players = players
        this.dealerIndex = 0
        this.currentStatus = STATUSES.NEWROUND
        this.commCards = []
        this.numPlayers = players.length
        this.pot = 0
        this.currentBet = 0
        this.eb = eb
        this.activeQueue = new Queue()

        this.eb.subscribe('actionDone', ({playerId, action, amount})=>{
            console.log(`Player ${playerId} performed ${action} with amount ${amount}`);
            this.pot += amount
            if(action === ACTIONS.RAISE || action === ACTIONS.BET) {
                this.currentBet = amount
            }
            this.checkRoundProgress()
            this.askNextPlayer()
        })
    }
    initQueue(startIndex){
        this.activeQueue = new Queue()
        for(let i = 0; i < this.numPlayers; i++) {
            const idx = (startIndex + i) % this.numPlayers;
            if(this.players[idx].status === 'ACTIVE' || this.players[idx].status === 'SMALLBLIND' || this.players[idx].status === 'BIGBLIND' || this.players[idx].status === 'UTG'){
                this.activeQueue.enqueue(this.players[idx]);
            }
        }
    }
    checkRoundProgress(){
        if(this.activeQueue.isEmpty()){
            switch(this.currentStatus){
                case STATUSES.PREFLOP:
                    this.currentStatus = STATUSES.FLOP
                    this.dealFlop()
                    break
                case STATUSES.FLOP:
                    this.currentStatus = STATUSES.TURN
                    this.dealTurn()
                    break
                case STATUSES.TURN:
                    this.currentStatus = STATUSES.RIVER
                    this.dealRiver()
                    break
                case STATUSES.RIVER:
                    this.currentStatus = STATUSES.NEWROUND
                    this.endRound()
                    break
            }
            // Reset the bet amount for new betting round
            this.currentBet = 0
            // Re-initialize queue for next round if not game over
            if(this.currentStatus !== STATUSES.NEWROUND) {
                this.initQueue((this.dealerIndex+1)%this.numPlayers)
            }
        }
    }

    askNextPlayer(){
        if(this.activeQueue.isEmpty()){
            return;
        }           
        const player = this.activeQueue.dequeue()
        // Show game state when asking for action
        console.log('\nCommunity cards:', this.commCards.map(c => c.rank + c.suit).join(' '))
        console.log('Current pot:', this.pot)
        console.log('Current bet:', this.currentBet)
        this.eb.publish('yourTurn', {
            playerId: player.id,
            currentBet: this.currentBet,
            pot: this.pot,
            minBet: minBet
        })
    }
    
    startRound(){
        this.gamedeck.shuffle() //reshuffle
        this.pot = 0
        this.dealerIndex = (this.dealerIndex + 1) % this.numPlayers //shift dealer
        if(this.players.length == 2){
            this.players[this.dealerIndex].status = PSTATUSES.SMALLBLIND
            this.players[(this.dealerIndex+1) % this.numPlayers].status = PSTATUSES.BIGBLIND
        }
        else if(this.numPlayers > 1){
            this.players[(this.dealerIndex) % this.numPlayers].status  = PSTATUSES.DEALER
            this.players[(this.dealerIndex+1) % this.numPlayers].status = PSTATUSES.SMALLBLIND
            this.players[(this.dealerIndex+2) % this.numPlayers].status = PSTATUSES.BIGBLIND
            this.players[(this.dealerIndex+3) % this.numPlayers].status = PSTATUSES.UTG
        }
        // Deal cards to players first
        for(let i=0; i<this.numPlayers; i++){ //deal 2 cards to each player
            for(let j=0; j<2; j++){
                this.players[(this.dealerIndex+1+i)%this.numPlayers].hand.push(this.gamedeck.deck.pop())
            }
        }
        this.startPreflop()
}
    startPreflop(){
        this.eb.publish('roundStatus', {status: 'PREFLOP'})
        this.pot += smallBlind + bigBlind
        this.initQueue((this.dealerIndex+3)%this.numPlayers)
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
        //evaluate the hands of remaining players and reset local variables
        this.commCards = [];
        this.pot = 0;
    }
}

let ebb = new EventBroker()
let cpu = new Player('CPU1', PSTATUSES.ACTIVE, 1000, ebb)
let you = new Player('P1', PSTATUSES.ACTIVE, 1000, ebb)
let g = new Game([cpu, you], ebb)
g.startRound()
