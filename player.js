import {ACTIONS, PSTATUSES, STATUSES} from './constants.js'
import {smallBlind, bigBlind} from './constants.js'
import readline from 'readline'

class Player{
    constructor(id, status, chips, eb){
        this.id = id;
        this.status = status || PSTATUSES.ACTIVE;
        this.chips = chips;
        this.hand = [];
        this.myTurn = false;
        this.currentAction = null;
        this.eb = eb;
        
        this.eb.subscribe('yourTurn', (data)=>{
            if(data.playerId === this.id){
                this.myTurn = true;
                console.log(`\nPlayer ${this.id}'s turn`)
                console.log('Your hand:', this.hand.map(c => c.rank + c.suit).join(' '))
                console.log('Your chips:', this.chips)
                console.log(`\nActions: ${Object.values(ACTIONS).join(', ')}`)
                console.log(`Current bet to call: ${data.currentBet}`)
                
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                rl.question('Enter action (e.g. "CALL 10" or "FOLD"): ', (answer) => {
                    const [actionType, amountStr] = answer.trim().split(' ');
                    const amount = amountStr ? parseInt(amountStr) : 0;
                    
                    try {
                        this.handleAction({
                            type: actionType,
                            amount: amount,
                            callAmount: data.currentBet
                        });
                    } catch(e) {
                        console.log('Invalid action:', e.message)
                    }
                    rl.close();
                }); 
            }
        })
        
        this.eb.subscribe('PREFLOP', ()=>{
            if(this.status === PSTATUSES.BIGBLIND){ this.chips -= Math.min(bigBlind, this.chips)}
            if(this.status === PSTATUSES.SMALLBLIND){ this.chips -= Math.min(smallBlind, this.chips)}
        })
        
    }
    
    handleAction({type, amount, callAmount}){
        if(!Object.values(ACTIONS).includes(type)){
            throw new Error('Invalid action type')
        }
        
        let paid = 0;
        switch(type){
            case ACTIONS.FOLD:
                this.currentAction = ACTIONS.FOLD
                this.status = PSTATUSES.FOLDED
                break;

            case ACTIONS.CHECK:
                if(callAmount > 0){
                    throw new Error('Cannot check when there is a bet to call')
                }
                this.currentAction = ACTIONS.CHECK
                break;

            case ACTIONS.CALL:
                if(callAmount === 0){
                    throw new Error('Nothing to call')
                }
                this.currentAction = ACTIONS.CALL
                paid = Math.min(callAmount, this.chips)
                this.chips -= paid
                break;

            case ACTIONS.BET:
                if(callAmount > 0){
                    throw new Error('Cannot bet when there is already a bet (use RAISE)')
                }
                if(amount < minBet){
                    throw new Error('Bet must be at least the minimum bet')
                }
                this.currentAction = ACTIONS.BET
                paid = Math.min(amount, this.chips);
                this.chips -= paid
                break;

            case ACTIONS.RAISE:
                if(callAmount === 0){
                    throw new Error('Cannot raise when there is no bet (use BET)')
                }
                if(amount <= callAmount){
                    throw new Error('Raise amount must be greater than current bet')
                }
                this.currentAction = ACTIONS.RAISE
                paid = Math.min(amount, this.chips);
                this.chips -= paid;
                break;
        }
        
        this.eb.publish('actionDone', {playerId: this.id, action: this.currentAction, amount: paid})
        if(this.chips === 0){
            this.status = PSTATUSES.INACTIVE;
            this.eb.publish('playerInactive', {playerId: this.id})
        }
    }
}
export default Player
