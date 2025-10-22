const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const SUITS = {'S':'♠', 'H':'♥', 'C':'♣', 'D':'♦'}
const shuffleTimes = 100

///xxxA KQJT 9876 5432 CDHS rrrr xxPP PPPP
const suits = "SHDC"
const ranks = "23456789TJQKA"
const primes = {'2':2, '3':3,'4':5, '5': 7, '6': 11, '7': 13, '8': 17, '9': 19, 'T': 23, 'J': 29, 'Q': 31, 'K': 37, 'A': 41}

class Card{
    constructor(suit, rank){
        this.suit = suit;
        this.rank = rank;
        this.bits = []
    }
    get_bits(){
        let rr = ranks.indexOf(this.rank)+16
        let sr = suits.indexOf(this.suit)+12
        let pr = primes[this.rank]
        this.bits = (1<<rr) | (1<<sr) | (pr) | (rr<<8)
    }
}   

class Deck {
    constructor(){
        this.deck = []
        for(const key in SUITS){
            for(let j=0; j<RANKS.length; j++){
                const c = new Card(SUITS[key], RANKS[j])
                this.deck.push(c)
            }
        }
    }
    reveal(){
        for(let i=0; i<this.deck.length; i++){
            console.log(this.deck[i].rank + "" + this.deck[i].suit)
        }
    }
    shuffle(){
        for(let t=0; t<shuffleTimes; t++){
            //Fisher-yates shuffle
            for(let i=this.deck.length-1; i>1; i--){
                const j = Math.floor(Math.random() * (i-0) + 0)
                let temp = this.deck[i]; this.deck[i] = this.deck[j];
                this.deck[j] = temp;
            }
        }
        console.log('Shuffled')
    }
}
export default Deck
//generate deck of 52 cards
//have function to shuffle cards
//have function to deal cards in sequential order on flop, turn, river
const jc = new Card('D', 'K')
jc.get_bits()
console.log(jc.bits.toString(2))