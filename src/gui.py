CARDS = {"bSpade" : '\u2660', "bHeart" : '\u2665', "bDiamond": '\u2666', "bClub" : '\u2663',
        "wSpade" : '\u2664', "wHeart" : '\u2661', "wDiamond" : '\u2666', "wClub" : '\u2667'
        }
#visual reprs
#print(u'\U0001f0A1')

#pot odd calculation

class Card:
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank
    
class Hand:
    def __init__(self, cards):
        self.cards = cards

cards = [] 
for c in CARDS:
    cards.append(c)

h = Hand(cards)
for c in h.cards:
    print(CARDS[c])

#remember to implement kicker card