import { Text } from "pixi.js";
import { TextStyles } from "../styles/textStyles";

export class InGameMessage extends Text {
    constructor() {
        super("", TextStyles.GAME_MSG);
        this.anchor.set(0.5);
        this.position.set(640,100);
    }
    public showMessage(msg: string): void {
        this.text = msg;
        setTimeout(() => { this.text = '' }, 3000);
    }
}