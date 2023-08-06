import { sound } from "@pixi/sound";
import { Text, Graphics } from "pixi.js";
import { Tween } from "tweedle.js";
import { MainScene } from "../scene/mainScene";
import { Manager } from "../scene/sceneManager";
import { MeterDisplay } from "../components/player/meterDisplay";

export class CreditsDisplay extends MeterDisplay {
    private _amount = 0;
    private _initAmount = 0;
    private _creditsAmount!: Text;
    private _creditsBox!: Graphics;
    public addBonusCredits(amount: number): void {
        this._initAmount = this._amount;
        this._amount += amount;
        this.animateCreditBox(amount);
    }
    private animateCreditBox(amount: number): void {
        let obj = { x: 0 }
        let t1 = new Tween(obj).to({ x: amount }, 2000).start(2400);
        t1.onAfterDelay(() => { sound.play('snd-rollup', { loop: true }); });
        t1.onUpdate(this.updateCredits.bind(this));
        t1.onComplete(this.onUpdateFinish.bind(this));
    }
    private updateCredits(obj: any): void {
        let amount = this._initAmount + Math.floor(obj.x);;
        this._creditsAmount.text = amount;
        this._creditsBox.tint = (amount % 2) ? 0xFF7F50 : 0xFFFFFF;
    }
    private onUpdateFinish(): void {
        sound.stop('snd-rollup');
        this._creditsAmount.text = this._amount;
        this._creditsBox.tint = 0xFFFFFF;
        Manager.transitionScene(new MainScene);
    }
}