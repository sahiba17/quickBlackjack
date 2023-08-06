import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Tween } from "tweedle.js";
import { TextStyles } from "../styles/textStyles";
import { StarAnimation } from "./starAnimation";
import { sound } from "@pixi/sound";

export class ResultDisplay extends Container {
    private _banner!: Sprite;
    private _bannerText!: Text;
    constructor(isWin:boolean) {
        super();
        this.createBG();
        this.createBanners();
        this.createBannerText();
        this.alpha = 0;
        this.showResult(isWin);
    }
    private createBG(): void {
        let bg = new Graphics();
        bg.lineStyle(1, 0x000);
        bg.beginFill(0x000, 0.5);
        bg.drawRect(0, 0, 1280, 720);
        bg.endFill();
        this.addChild(bg);
    }
    private createBanners(): void {
        this.addChild(this._banner = Sprite.from('banner'));
        this._banner.scale.set(0.1);
        this._banner.position.set(640, 360);
        this._banner.anchor.set(0.5);

    }
    private createBannerText(): void {
        this._bannerText = new Text("", TextStyles.RESULT);
        this._bannerText.anchor.set(0.5, 0.5);
        this.addChild(this._bannerText);
        this._bannerText.position.set(640, 315);
    }
    private addStars(): void {
        let s = new StarAnimation();
        s.position.set(640, 315);
        this.addChild(s);
    }
    private showResult(isWin: boolean): void {
        this._banner.tint = isWin ? 0xffffff : 0x333333;
        this._bannerText.tint = isWin ? 0xffffff : 0x888888
        new Tween(this).to({ alpha: 1 }, 200).start().onComplete(() => {
            sound.play('snd-result');
            if (isWin) {
                this.addStars();
                this._bannerText.text = "PLAYER1 WINS!"
            } else {
                this._bannerText.text = "DEALER WINS!"
            }
        });
        setTimeout(this.hideResult.bind(this),1200);
    }
    private hideResult():void{
        new Tween(this).to({ alpha: 0 }, 300).start().onComplete(() => {
            this.destroy();
        });
    }
}