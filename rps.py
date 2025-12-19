import random
import sys
from enum import Enum

rounds=int(input("How many rounds you want to play"))
current_round=1
user_score=0
computer_score=0

class Rps(Enum):
    ROCKS = 1
    PAPERS = 2
    SCISSORS = 3


def decide_winner(user, computer):
    wins = {1: 3, 2: 1, 3: 2}
    if user == computer:
        return "Its a tie"
    elif wins[user] == computer:
        return "user Wins"
    else:
        return "computer wins"


while current_round <= rounds:
    try:
        Userchoice = int(input("Enter 1 for Rocks 2 for papers 3 for scissors\n"))
    except ValueError:
        sys.exit("Please enter an integer")
    else:
        if Userchoice not in (1, 2, 3):
            sys.exit("Enter 1 or 2 or 3 ")

    computerchoice = random.choice("123")
    computer = int(computerchoice)

    print("Your Choice:", str(Rps(Userchoice)).replace("Rps.", ""))
    print("pyhton Choice:", str(Rps(computer)).replace("Rps.", ""))

    result=decide_winner(Userchoice, computer)
    print(result)

    if result == "user Wins":
        user_score += 1
    elif result == "computer wins":
        computer_score += 1
    else:
        pass
    current_round+=1


print("Score -> You:", user_score, "Python:", computer_score)

if user_score>computer_score:
    print("You win")
else:
    print("Computer wins")
