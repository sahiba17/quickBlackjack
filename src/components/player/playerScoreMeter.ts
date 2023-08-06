import { MeterDisplay } from "./meterDisplay";

export class PlayerScoreMeter extends MeterDisplay {
    constructor(text:string) {
        super(text);
        this.scale.set(0.65);
        this.meterBG.tint = 'blue'
    }
    public updateScore(s:number):void{
        this.meterTF.text = s;
    }
}