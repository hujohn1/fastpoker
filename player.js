class Player{
    constructor(id, status, chips, hand){
        this.id = id; this.status = status; this.chips = chips; this.hand = [];
        const actions = ['FOLD', 'CHECK', 'CALL', 'RAISE', 'BET'];

        //make sure that if no more chips, status is INACTIVE
        if(this.chips <= 0 || this.currentAction === 'FOLD'){
            this.status = 'INACTIVE';
        }
        if(this.status == 'BIGBLIND'){

        }
        if(this.status == 'SMALLBLIND'){

        }
        
        if(this.status === 'DEALER'){
            if(this.currentAction === 'BET'){
                this.chips -= min(amount, this.chips);
            }
        }
        if(this.currentAction === 'RAISE'){
            this.chips -= min(amount, this.chips);
        }
        else if(this.currentAction === 'CALL'){
            if(callAmount > this.chips){
                this.chips -= min(callAmount, this.chips);
            }   
        }
    }

}
export default Player
