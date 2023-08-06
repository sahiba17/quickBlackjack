import { Sprite, Texture } from "pixi.js";
import { Tween } from "tweedle.js";

export class Card extends Sprite {
    private _id: number;
    private _value: number;
    private _type: string;
    private isRevealed: boolean = true;
    constructor(id: string, hide: boolean = false) {
        let cardDetails = id;
        if (hide) {
            id = "card-back";
        }
        super(Texture.from(id));
        let c = cardDetails.split('-');
        this._id = parseInt(c[1]);
        this._type = c[0];
        this._value = this._id > 10 ? 10 : this._id;
        this.anchor.set(0, 1);
        this.scale.set(0.25, 0.25);
        this.position.set(1400, -200)
        this.isRevealed = !hide;
    }
    public revealCard(): void {
        if (!this.isRevealed) {
            this.flip();
            this.isRevealed = true;
        }
    }
    private flip(): void {
        this.anchor.set(0.5, 1);
        this.position.set(300 + this.width * 0.5, 300);
        let t = new Tween(this.scale).to({ x: 0, y: 0.25 }, 100).start();

        t.onComplete(() => {
            this.texture = Texture.from(this._type + '-' + this._id);
            new Tween(this.scale).to({ x: 0.25, y: 0.25 }, 100).start().onComplete(() => {
                this.anchor.set(0, 1);
                this.position.set(300, 300);
            });
        });
    }
    get id(): number {
        return this._id;
    }
    get type(): string {
        return this._type;
    }
    get value(): number {
        return this._value;
    }
    set value(n:number) {
        this._value=n;
    }
}