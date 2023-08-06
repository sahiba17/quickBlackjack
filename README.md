# quickBlackjack
assignment to create blackjack

This game is created in typescript using Pixi.js

Deployment :

Please download the source code and run the following commands in the terminal of the root folder:
  npm install
  -to install node modules

  npm start
  -to start the server and run the game on port 1234. (localhost:1234)

  npm run build-only
  -to create a deployable version in the dist folder. (not really necessary, until deploying)

Game Play :

The game opens with a betting panel where the user can select and add up bet amounts by clicking on the chips. The initial Credit that the user has is EUR 1000 and the bet can only be less or equal to it.
Closing the panel, the user gets an option to play the game. In case the user closes the betting panel without selecting a bet, it can be opened again but clicking the bet meter. As soon as the user clicks "PLAY" the cards are distributed and the bet gets deducted but is still visible in the bet meter. 
Now the user can HIT or STAND and results are shown accordingly (after Dealer's cards reveal, or hit/stand decision). 
During the results, in case of a win or tie, the win amount is added to the credit. (2x in case of a win and bet amount in case of a tie)
A win is celebrated with a gold ribbon and stars animating while a loss is depicted with a grey ribbon.
Another game can be played after the results, as the cards get shuffled, the user needs to select the bets again. 
In-game messages can be seen on the top of the game screen.
The game is scalable to be played in any screen ratio(though not positioned centrally)

Game Logic :

All cards have the same values except face cards. (J, Q, K being 10 and A being 11 or 1 at times)
On every card draw the values of the player's cards are evaluated and then the user is given the choice of HIT or STAND accordingly. (i.e, if it's not a BUST or BLACKJACK)
Once the user STANDs, or there's a BLACKJACK, the Dealer's card is revealed and checked for Dealer's choices. (HIT/STAND or a TIE)
Dealer's HIT and STAND decision is made on a random basis here with a 50% probability of both.

Disclaimer :

I realized I missed a couple of points after creating the game and going through the requirements.
- I used tweedle js instead of GSAP for tweening. I had already used tweedle.js before realizing the requirement of GSAP. I did not re-do it using Greensock considering the similarities between the both and also the time constraint.
- I was doubtful about the 3rd point "The user can increase his wager". If it meant during the match or not, so I continued with a fixed bet for a match and deduct it before drawing cards. If it was the other way, I can surely add it to the Future Scope section.

I downloaded the assets used in this game from the internet, (and the cards from itch.io) and they are around 20MB. It takes a while to load on netlify server. but runs smoothly on local.
The game colours look darker and hence, not so distinguishable on the mobile as on the desktop.

Scope of Improvement :
- game pause and resume can be added.
- game used onComplete events of Tweens. and some tickers and timers. I prefer Timers over setTimeouts as they are pausable or callbacks through async await.
- more animations can be added, like on the credits box or some celebrations.
- interactivity can be increased while selecting the bet, maybe the use of the swiping chips to increase the bet.
- instructions or help-page can be included.
- more sounds can be added.
- other blackjack functionalities can be added.

