from itertools import permutations

#const
NUM_PLAYERS = 8
SEED = 10

blank = u"\U0001F0A2"
suitmap = {65: "S", 66 : "H", 67: "D", 68: "C"}
rankmap = {1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 65: "10", 66: "J", 68: "Q", 69: "K"}

class Card:
    def __init__(self, suit, rank, val):
        self.suit = suit
        self.rank = rank
        self.val = val
    
class Hand:
    def __init__(self, cards):
        self.cards = cards

    def print(self):
        for s in self.cards:
            print(s.suit+","+s.rank)

class Player():
    def __init__(self, hand, amt):
        self.hand = hand
        self.amt = amt

class Game():
    def __init__(self):
        pass
    def simulate_n_rounds(n: int):
        
        print(p for p in permutations(h.cards))
        for i in range(n):
            p = Player()


with open('x.txt', 'w', encoding='utf8') as file:
    ustring = r"\U0001F0A1"
    file.write(ustring.encode().decode('unicode_escape'))

fulldeck = []
cards = [f"1F0{chr(y)}{x}" for y in range(65,69) for x in rankmap.keys]
for c in cards:
    repr = int(f"0x{c}", 16)
    card = Card(suitmap[y], rankmap[x], repr)
    fulldeck.append(repr)

print(len(fulldeck))
#remember to implement kicker card checkings
#permute randomly, riffle shuffle, boxcut, playercut 5 times
#Have ordering of dealer turns


#flop(3), turn, river
#Implement a ranking system
#during showdown, use mp compare the presence of pair, triple, four, fullhouse, 
#rflush>sflush>4kind>fullhouse>straight>3kind>2pair>pair
#if in equivalent class, use the actual cards
#if actual cards the same, use the remaining kickers

#use flag for still remaining in round, isPlaying
#Each player needs two options: Raise up to their allot amount, Call, Fold
#YOU NEED TO REMOVE THE CARDS FROM THE LIST WHEN DONE SINCE USING ONE DECK!!!
