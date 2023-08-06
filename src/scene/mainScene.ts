import { Container, Graphics, Sprite, Text, Ticker } from "pixi.js";
import { Easing, Group, Tween } from "tweedle.js";
import { IScene, Manager } from "../scene/sceneManager";
import { TextStyles } from "../styles/textStyles";
import { BlackjackGameScene } from "./blackjackGameScene";
import { sound } from "@pixi/sound";

export class MainScene extends Container implements IScene {
    private _titleText: Text = new Text;
    private _proceedBtn: Graphics = new Graphics;
    constructor() {
        super();
        let bg = Sprite.from('bg');
        bg.tint = 'green';
        this.addChild(bg);//adding background
        this.addTittleText();
        this.addProceedButton();

        Ticker.shared.add(this.update, this);
    }
    private addTittleText(): void {
        this._titleText = new Text("Quik Gaming Blackjack", TextStyles.TITLE);
        this._titleText.anchor.set(0.5, 0.5);
        this._titleText.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(this._titleText);
    }
    private addProceedButton(): void {
        this._proceedBtn = new Graphics();
        this._proceedBtn.lineStyle(5, 0xfd881d, 1);
        this._proceedBtn.beginFill(0xfccd45, 0.85);
        this._proceedBtn.drawRoundedRect(0, 0, 300, 70, 50);
        this._proceedBtn.endFill();
        this._proceedBtn.pivot.set(150, 35);
        this._proceedBtn.position.set(Manager.width / 2, Manager.height * 2 / 3);
        this._proceedBtn.addChild(this.getBtnText());
        this.addChild(this._proceedBtn);
        this.addProceedBtnEvent();
    }
    private getBtnText(): Text {
        let t = new Text("Press Here", TextStyles.AMOUNT);
        t.anchor.set(0.5);
        t.position.set(150, 35);
        return t;
    }
    private addProceedBtnEvent(): void {
        this._proceedBtn.interactive = true;
        this._proceedBtn.on('pointertap', this.onSpinBtnTap, this);
        this._proceedBtn.cursor = 'pointer';
    }
    private removeSpinBtnEvent(): void {
        this._proceedBtn.removeEventListener('pointertap', this.onSpinBtnTap);
        this._proceedBtn.cursor = 'default';
        this._proceedBtn.interactive = false;
    }
    private animateBtn(): void {
        let t = new Tween(this._proceedBtn.scale);
        t.to({ x: 0, y: 0 }, 500).easing(Easing.Back.In);
        t.onComplete(this.removeBtn.bind(this));
        t.onComplete(this.loadBonusScene.bind(this));
        t.start();
    }
    private onSpinBtnTap(): void {
        sound.play('snd-click');
        this.removeSpinBtnEvent();
        this.animateBtn();
    }
    private removeBtn(): void {
        this.removeChild(this._proceedBtn);
    }
    private loadBonusScene(): void {
        Manager.transitionScene(new BlackjackGameScene);
    }
    update(framesPassed: number): void {
        framesPassed;
        Group.shared.update()
    }
}