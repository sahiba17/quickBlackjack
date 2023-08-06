import { Container, Sprite } from "pixi.js";
import { Group } from "tweedle.js";
import { GameMath } from "../math/gameMath";
import { IScene, Manager } from "./sceneManager";
import { Player } from "../components/player/player";
import { Button } from "../components/button";
import { BetSelector } from "../components/betSelection/betSelection";
import { WagerInfo } from "../components/wagerInfo";
import { GameSignals } from "../signals/gameSignals";
import { ResultDisplay } from "../components/resultDisplay";
export class BlackjackGameScene extends Container implements IScene {
    private _player1!: Player;
    private _dealer!: Player;
    private _btnPlay!: Button;
    private _btnHit!: Button;
    private _btnStand!: Button;
    private _wagerDisplay!: WagerInfo;
    private _betSelector!: BetSelector;
    constructor() {
        super();
        this.addBackground();
        this.createPlayers();
        this.createButtons();
        this.disablePlayerBtns();
        this.addPlayBtn();
        Manager.EventEmitter.addListener(GameSignals.ENABLE_BET_BTN, (this.enablePlayBtn.bind(this)));
        Manager.EventEmitter.addListener(GameSignals.DISABLE_BET_BTN, (this.disablePlayBtn.bind(this)));

        this.addChild(this._betSelector = new BetSelector());
        this._betSelector.show(true);

        this.createWagerDisplay();

        this.addChild(Manager.InGameMessage);
    }
    private createWagerDisplay(): void {
        this.addChild(this._wagerDisplay = new WagerInfo());
    }
    private startGame(): void {
        this._dealer.show();
        this._player1.show();

        this.shuffleCards();
        this.distributeCards();

        setTimeout(() => {
            if (this.canPlayerProceed()) {
                this.enablePlayerBtns();
            }
        }, 900);

    }
    private shuffleCards(): void {
        GameMath.CARDS.concat(GameMath.DISTIBUTED_CARDS);
        GameMath.DISTIBUTED_CARDS = [];
    }
    private distributeCards(): void {
        this._dealer.addCard(this.drawCardFromDeck(), false, 0);
        this._player1.addCard(this.drawCardFromDeck(), false, 200);
        this._dealer.addCard(this.drawCardFromDeck(), true, 400);
        this._player1.addCard(this.drawCardFromDeck(), false, 600);
    }
    private drawCardFromDeck(): string {
        let card = GameMath.CARDS.splice(GameMath.randomIntInRange(0, GameMath.CARDS.length - 1), 1)[0];
        GameMath.DISTIBUTED_CARDS.push(card);
        return card;
    }

    private addBackground(): void {
        let bg = Sprite.from('bg');
        bg.tint = 'green';
        this.addChild(bg);
    }
    private createPlayers(): void {
        this._dealer = new Player(1, 'DEALER');
        this._dealer.position.set(250, 0);

        this._player1 = new Player(1, 'PLAYER 1');
        this._player1.position.set(250, 300);

        this.addChild(this._player1);
        this.addChild(this._dealer);

        this._dealer.hide();
        this._player1.hide();
    }

    private createButtons(): void {
        this.addChild(this._btnHit = new Button("HIT"));
        this.addChild(this._btnStand = new Button("STAND"));

        this._btnHit.position.set(500, 650);
        this._btnStand.position.set(800, 650);

        this._btnHit.addEvent(this.onHitPressed.bind(this));
        this._btnStand.addEvent(this.onStandPressed.bind(this));
    }
    private enablePlayerBtns(): void {
        this._btnHit.enable();
        this._btnStand.enable();
    }
    public disablePlayerBtns(): void {
        this._btnHit.disable();
        this._btnStand.disable();
    }
    private onHitPressed(): void {
        this.disablePlayerBtns();
        this._player1.addCard(GameMath.CARDS.splice(GameMath.randomIntInRange(0, GameMath.CARDS.length - 1), 1)[0], false, 0);
        setTimeout(() => {
            if (this.canPlayerProceed()) {
                this.enablePlayerBtns();
            }
        }, 300);
    }
    private onStandPressed(): void {
        this.disablePlayerBtns();
        setTimeout(this.revealDealerCard.bind(this), 300);
        setTimeout(this.compareScoresAndProceed.bind(this), 600);
    }
    private revealDealerCard(): void {
        this._dealer.revealCard();
    }
    private addPlayBtn(): void {
        this.addChild(this._btnPlay = new Button("PLAY"));
        this._btnPlay.position.set(640, 360);
        this._btnPlay.addEvent(this.onPlayBtnPress.bind(this));
    }
    private onPlayBtnPress(): void {
        if (this.canBeginPlay()) {
            this.disablePlayBtn();
            this._btnPlay.visible = false;
            Manager.EventEmitter.emit(GameSignals.DISABLE_BET_BTN);

            GameMath.BALANCE -= GameMath.BET;
            Manager.EventEmitter.emit(GameSignals.CHIPS_SELECTION);

            setTimeout(this.startGame.bind(this), 500);
        } else {
            Manager.InGameMessage.showMessage("PLEASE CLICK BET METER TO SELECT A BET.")
        }
    }
    private enablePlayBtn(): void {
        this._btnPlay.enable();
    }
    private disablePlayBtn(): void {
        this._btnPlay.disable();
    }
    private canBeginPlay(): boolean {
        return (GameMath.BET <= GameMath.BALANCE && GameMath.BET > 0);
    }
    private canPlayerProceed(): boolean {
        if (this._player1.score < 21) {
            return true;
        } else {
            if (this._player1.score == 21) {
                this.onBlackJack();
            } else {
                this.onBust();
            }
            return false;
        }
    }
    private showWin(): void {
        this.addChild(new ResultDisplay(true));
    }
    private showLoss(): void {
        this.addChild(new ResultDisplay(false));
    }
    private onBlackJack(): void {
        Manager.InGameMessage.showMessage("PLAYER1 BLACKJACK!");
        setTimeout(this.revealDealerCard.bind(this), 300);
        setTimeout(this.compareScoresAndProceed.bind(this), 600);
    }
    private onWin(): void {
        GameMath.BALANCE += GameMath.BET * 2;
        GameMath.BET = 0;
        this.updateBalance();
        setTimeout(this.showWin.bind(this), 500);

        setTimeout(this.resetGame.bind(this), 2000);
    }
    private onLoss(): void {
        GameMath.BET = 0;
        this.updateBalance();
        setTimeout(this.showLoss.bind(this), 500);
        setTimeout(this.resetGame.bind(this), 2000);
    }
    private onBust(): void {
        Manager.InGameMessage.showMessage("BUST!");
        this.revealDealerCard();
        setTimeout(this.onLoss.bind(this), 300);
    }
    private onPush(): void {
        Manager.InGameMessage.showMessage("PUSH!");
        GameMath.BALANCE += GameMath.BET;
        GameMath.BET = 0;
        this.updateBalance();
        setTimeout(this.resetGame.bind(this), 900);
    }
    private compareScoresAndProceed(): void {
        if (this._dealer.score === this._player1.score) {
            this.onPush();
        } else if (this._dealer.score > this._player1.score && this._dealer.score <= 21) {
            if (this._dealer.score === 21) { Manager.InGameMessage.showMessage("DEALER BLACKJACK!") }
            setTimeout(this.onLoss.bind(this), 500);
        } else {
            if (this._dealer.score > 21 || this.doDealerStand()) {
                setTimeout(this.onWin.bind(this), 500);
            } else {
                setTimeout(this.hitForDealer.bind(this), 500);
            }
        }
    }
    private hitForDealer(): void {
        this._dealer.addCard(GameMath.CARDS.splice(GameMath.randomIntInRange(0, GameMath.CARDS.length - 1), 1)[0], false, 0);
        setTimeout(() => {
            this.compareScoresAndProceed();
        }, 300);
    }
    private doDealerStand(): number {
        return GameMath.randomIntInRange(0, 1);
    }
    private updateBalance(): void {
        this._wagerDisplay.updateWagerInfo();
    }
    private resetGame(): void {
        this._player1.reset();
        this._player1.hide();
        this._dealer.reset();
        this._dealer.hide();
        this._btnPlay.visible = true;
        this._betSelector.show();
    }
    update(framesPassed: number): void {
        framesPassed;
        Group.shared.update();
    }
}