import { Container } from "pixi.js";
import { Card } from "../card";
import { CardsDisplay } from "../cardsDisplay";
import { PlayerScoreMeter } from "./playerScoreMeter";

export class Player extends Container {
    private _id: number;
    private _name: string;
    private _hasAce:boolean=false;
    private _isAce11:boolean=false;
    protected balance: number = 0;
    protected hiddenCards!: Card;
    protected cardDisplay: CardsDisplay;
    public score: number = 0;
    protected scoreTF: PlayerScoreMeter;

    constructor(id: number, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.scoreTF = new PlayerScoreMeter(this._name);
        this.scoreTF.position.set(450, 220);
        this.addChild(this.scoreTF);
        this.cardDisplay = new CardsDisplay();
        this.addChild(this.cardDisplay);
    }

    public addCard(id: string, hide: boolean, delay: number): void {
        let card = new Card(id, hide);
        this.cardDisplay.addCard(card, delay);
        if (!hide) {
            this.score += this.getCardValue(card);//card.value;
            this.scoreTF.updateScore(this.score);
        } else {
            this.hiddenCards = card;
        }
        this.ajustAceValue();
    }
    public revealCard(): void {
        this.hiddenCards && this.hiddenCards.revealCard();
        this.score += this.getCardValue(this.hiddenCards);//this.hiddenCards.value;
        this.scoreTF.updateScore(this.score)
    }
    public hide(): void {
        this.visible = false;
    }
    public show(): void {
        this.visible = true;
    }
    public reset(): void {
        this.cardDisplay.reset();
        this.score = 0;
        this.scoreTF.updateScore(this.score);
    }
    private getCardValue(card:Card):number{
        if(card.id === 1){
            this._hasAce = true;
            this._isAce11 = true;
            card.value = 11;
        }
        return card.value;
    }
    public ajustAceValue():void{
        if(this._hasAce){
            if(this.score>21 && this._isAce11){
                this._isAce11 = false;
                this.score -= 10;
                this.scoreTF.updateScore(this.score);
            }
        }
    }
    get id(): number {
        return this._id;
    }
    get type(): string {
        return this._name;
    }
}