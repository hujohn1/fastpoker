const actions = ['FOLD', 'CHECK', 'CALL', 'RAISE', 'BET'];

class Player{
    constructor(id, status, chips){
        this.id = id; this.status = status; this.chips = chips; this.hand = []; this.myTurn = false; this.currentAction = null;
        //make sure that if no more chips, status is INACTIVE
        if(this.chips <= 0 || this.currentAction === 'FOLD'){
            this.status = 'INACTIVE';
            sendMessage('playerInactive', {playerId: this.id})
        }
        act(amount, callAmount){
            
        }
        if(this.status == 'BIGBLIND'){
            this.chips -= min(bigBlind, this.chips)
        }
        if(this.status == 'SMALLBLIND'){
            this.chips -= min(smallBlind, this.chips)
        }

        if(this.status === 'DEALER'){
            if(this.currentAction === 'BET'){
                this.chips -= min(amount, this.chips);
            }
        }
        if(this.currentAction === 'RAISE'){
            if(amount > callAmount){
                this.chips -= min(amount, this.chips);
            }else{
                throw new Error('Raise amount must be greater than call amount');
            }
        }
        else if(this.currentAction === 'CALL'){
            if(callAmount > this.chips){
                this.chips -= min(callAmount, this.chips);
            }   
        }
        else if(this.currentAction === 'FOLD'){
            this.status = 'FOLDED';
        }
        sendMessage("actionDone", {playerId: this.id, action: this.currentAction, amount: amount})
        this.myTurn = false;
    }
}
export default Player
