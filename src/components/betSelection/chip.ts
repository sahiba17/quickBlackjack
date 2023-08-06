import { Sprite, Texture, Text, Circle } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { sound } from "@pixi/sound";
import { GameMath } from "../../math/gameMath";
import { Manager } from "../../scene/sceneManager";
import { GameSignals } from "../../signals/gameSignals";
import { TextStyles } from "../../styles/textStyles";

export class Chip extends Sprite {
    private _id: number;
    private _tf!: Text;
    constructor(id: number) {
        super(Texture.from('chip' + id));
        this._id = id;
        this.anchor.set(0.5, 0.5);
        this.x = (parseInt((this._id / 2).toString()) * this.width) + this.width / 2;
        this.y = ((this._id % 2) * this.height) + this.height / 2;
        this.addText(GameMath.CHIPS[this._id].toString());
    }

    private addText(text: string): void {
        this._tf = new Text(text, TextStyles.CHIP);
        this._tf.anchor.set(0.5, 0.5);
        this.addChild(this._tf);
    }
    public addEvents(): void {
        this.interactive = true;
        this.hitArea = new Circle(0,0,120);
        this.on('pointertap', this.onClick, this);
        this.on('pointerenter', this.onHover, this);
        this.on('pointerleave', this.onHoverOut, this);
        this.cursor = 'pointer';
    }
    public removeEvents():void{
        this.interactive = false;
        this.hitArea = null;
        this.removeAllListeners();
        this.cursor = 'default';
    }
    private onHover(): void {
        this.scale.set(1.03);
    }
    private onHoverOut(): void {
        this.scale.set(1);

    }
    private onClick(): void {
        sound.play('snd-click');
        let sum = GameMath.BET + GameMath.CHIPS[this._id];
        if (sum <= GameMath.BALANCE) {
            new Tween(this.scale).to({ x: 0.97, y: 0.97 }, 30).start().yoyo(true).repeat(1).easing(Easing.Bounce.InOut).onComplete(() => {
                GameMath.BET = sum;
                Manager.EventEmitter.emit(GameSignals.CHIPS_SELECTION);
            });
        } else {
            Manager.InGameMessage.showMessage("BET CAN NOT EXCEED BALANCE");
        }
    }
}