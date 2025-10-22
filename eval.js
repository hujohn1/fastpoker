const evaluation=(hand)=>{
    let [heartSum, diamondSum, clubSum, spadeSum] = [0, 0, 0, 0]
    heartSum = hand.filter(x=> x=='H').length
    diamondSum = hand.filter(x=> x=='D').length
    spadeSum = hand.filter(x=> x=='S').length
    clubSum = hand.filter(x=> x=='C').length
    console.log(heartSum);
}

evaluation(['H', 'D', 'S'])