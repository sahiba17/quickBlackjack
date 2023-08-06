import { Text, Container, Graphics } from "pixi.js";
import { TextStyles } from "../../styles/textStyles";

export class MeterDisplay extends Container {
    protected titleTF!: Text;
    protected meterTF!: Text;
    protected meterBG!: Graphics;
    constructor(text: string) {
        super();
        this.createBoxBG();
        this.createTitleTF(text);
        this.createCreditsAmountTF();
    }
    private createBoxBG(): void {
        this.meterBG = new Graphics();
        this.meterBG.lineStyle(5, 0xfd881d, 0.8);
        this.meterBG.beginFill(0xfccd45, 0.8);
        this.meterBG.drawRoundedRect(0, 0, 200, 70, 10);
        this.meterBG.endFill();
        this.addChild(this.meterBG);
    }
    private createTitleTF(text: string): void {
        this.titleTF = new Text(text, TextStyles.CREDIT);
        this.meterBG.addChild(this.titleTF);
        this.titleTF.anchor.set(0.5, 1);
        this.titleTF.position.set(100, 8);
    }
    private createCreditsAmountTF(): void {
        this.meterTF = new Text(0, TextStyles.AMOUNT);
        this.meterBG.addChild(this.meterTF);
        this.meterTF.anchor.set(0.5);
        this.meterTF.position.set(100, 35);
    }
    public updateMeter(amount: number): void {
        this.meterTF.text = "€ " + amount;
    }
}