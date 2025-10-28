const ACTIONS = {FOLD: 'FOLD', CHECK: 'CHECK', CALL: 'CALL', RAISE: 'RAISE', BET: 'BET'};
const PSTATUSES = {ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE', FOLDED: 'FOLDED', DEALER: 'DEALER', UTG: 'UTG', SMALLBLIND: 'SMALLBLIND', BIGBLIND: 'BIGBLIND'};
const STATUSES = {
        NEWROUND: {transitions: ["WAITING"]},
        WAITING: {transitions: ["END", "PREFLOP"]},
        PREFLOP: {transitions: ["FLOP"]}, 
        FLOP: {transitions: ["TURN"]}, 
        TURN: {transitions: ["RIVER"]}, 
        RIVER: {transitions: ["NEWROUND", "END"]}, 
}

const minBet = 10;
const smallBlind = minBet/2;
const bigBlind = minBet; 
export {smallBlind, bigBlind, minBet}
export {ACTIONS, PSTATUSES, STATUSES}
