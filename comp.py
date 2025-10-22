from itertools import permutations, combinations
from functools import reduce
#xxxAKQJT 98765432 CDHSrrrr xxPPPPPP

suits = "SHDC"
ranks = "23456789TJQKA"
ranks2 = "23456789TJQKA"
primes = {'2':2, '3':3,'4':5, '5': 7, '6': 11, '7': 13, '8': 17, '9': 19, 'T': 23, 'J': 29, 'Q': 31, 'K': 37, 'A': 41}

#00001000 00000000 01001011 00100101    King of Diamonds
#1000000                    00100101
#                    1011011 00100101

class Card:
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit
        self.bits = self.get_bits(rank, suit)

    def get_bits(self, rank, suit):
        rr = ranks.index(rank)+16
        sr = suits.index(suit)+12
        pr = primes[rank]

        return (1<<rr) | (1<<sr) | (pr) | (rr<<8)
    
flushes = [0] * 7937
unique5 = []
def get_all_flushes():
    cnt = 1599
    with open("test.txt", 'w') as file:
        for fivetuple in combinations(ranks2, 5):
            cards = []
            for c in fivetuple:
                file.write(f"{c}")
                cards.append(Card(c, 'D'))
            file.write("\n")
            q = return_q(cards)
            file.write(f"{q}:{bin(q)}<-{cnt}\n")
            flushes[q] = cnt
            cnt-=1

#q = (c1.bits & 0xFF) * (c2.bits & 0xFF) * (c2.bits & 0xFF) * (c4.bits & 0xFF) * (c5.bits & 0xFF)

def return_q(cards):
    #bitOrs = map(lambda c: c.bits& 0xF000, cards)
    return reduce(lambda x, y: x|y.bits, cards, 0) >> 16

c1 = Card('K','D')
c2 = Card('Q', 'D')
c3 = Card('J', 'D')
c4 = Card('T', 'D')
c5 = Card('A', 'D')

print(f"{format(c1.bits, '#b')}")
get_all_flushes()

with open("flushes.txt", 'w') as file:
    for ix, f in enumerate(flushes):
        file.write(f"{f},")
