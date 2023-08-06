import { Container } from "pixi.js";
import { Card } from "./card";
import { Tween, Easing } from "tweedle.js";

export class CardsDisplay extends Container {
    private _cards: Card[] = [];
    public addCard(card: Card, delay: number): void {
        new Tween(card).to({ x: 300, y: 300 }, 200).delay(delay).start().easing(Easing.Quadratic.Out).onComplete(() => {
            this._cards.push(card);
            this.adjustAllCards();
        });
        this.addChild(card);
    }
    private adjustAllCards(): void {
        for (let c = 0; c < this._cards.length; c++) {
            const a = - (this._cards.length - c - 1) * 20;
            new Tween(this._cards[c]).to({ angle: a }, 100).start().easing(Easing.Quadratic.Out);
        }
    }
    public reset(): void {
        while (this._cards.length) {
            this._cards.pop()?.destroy();
        }
    }
}