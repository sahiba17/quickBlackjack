import { Graphics, Text } from "pixi.js";
import { TextStyles } from "../styles/textStyles";
import { Tween, Easing } from "tweedle.js";
import { sound } from "@pixi/sound";

export class Button extends Graphics {
    private _onClinkEvent!: Function;
    private _oneTime: boolean = false;
    constructor(text: string) {
        super();
        this.addButtonBG();
        this.addText(text);
    }
    private addButtonBG(): void {
        this.lineStyle(5, 0xfd881d, 1);
        this.beginFill(0xfccd45, 0.85);
        this.drawRoundedRect(0, 0, 160, 50, 25);
        this.endFill();
        this.pivot.set(80, 25);
    }
    private addText(text: string): void {
        let t = new Text(text, TextStyles.AMOUNT);
        t.anchor.set(0.5);
        t.position.set(80, 25);
        this.addChild(t);
    }
    public disable(): void {
        this.interactive = false;
        this.removeAllListeners();
        this.cursor = 'default';
        this.alpha = 0.7;
        this.tint = 0x808080;
    }
    public enable(): void {
        if (this._onClinkEvent) {
            this.interactive = true;
            this.on('pointertap', () => {
                // this.disable();
                let val = this._oneTime ? 0 : 0.9;
                sound.play('snd-click');
                new Tween(this.scale).to({ x: val, y: val }, 100).start().yoyo(true).repeat(1).easing(Easing.Quadratic.Out).onComplete(() => { this._onClinkEvent(); });
            });
            this.on('pointerenter', this.addHoverEvent.bind(this));
            this.on('pointerleave', this.addHoverOutEvent.bind(this));
            this.cursor = 'pointer';
            this.alpha = 1;
            this.tint = 0xffffff;
        }
    }
    public addEvent(fn: Function, oneTime: boolean = false): void {
        this._onClinkEvent = fn;
        this._oneTime = oneTime;
    }
    private addHoverEvent(): void {
        this.scale.set(1.1);
    }
    private addHoverOutEvent(): void {
        this.scale.set(1);
    }
}