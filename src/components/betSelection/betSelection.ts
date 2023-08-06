import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../../scene/sceneManager";
import { TextStyles } from "../../styles/textStyles";
import { GameMath } from "../../math/gameMath";
import { Chip } from "./chip";
import { GameSignals } from "../../signals/gameSignals";
import { Easing, Tween } from "tweedle.js";
import { Button } from "../button";
import { sound } from "@pixi/sound";

export class BetSelector extends Container {
    private _titleText: Text = new Text;
    private _closeBtn!: Sprite;
    private _clearBetBtn!: Button;
    private _chips: Chip[] = [];
    constructor() {
        super();
        this.addBG();
        this.addTittleText();
        this.addCloseBtn();
        this.addClearBetBtn();
        Manager.EventEmitter.addListener(GameSignals.BET_CLICKED, this.show.bind(this));

    }
    private addTittleText(): void {
        this._titleText = new Text("CLICK CHIPS TO INCREASE BET.\n  CLICK CLEAR TO RESET BET.\n          CLICK X TO CLOSE.", TextStyles.SELECT_BET);
        this._titleText.anchor.set(0.5, 0.5);
        this._titleText.position.set(this.width / 2, this.height / 2);
        this.addChild(this._titleText);
    }
    private addBG(): void {
        let bg = new Graphics();
        bg.lineStyle(3, 0x000);
        bg.beginFill(0x000, 0.85);
        bg.drawRoundedRect(0, 0, 1200, 700, 3);
        bg.endFill();
        bg.pivot.set(600, 350);
        bg.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(bg);
        this.addChips();
    }
    private addCloseBtn(): void {
        this._closeBtn = Sprite.from('close-btn');
        this._closeBtn.scale.set(0.20);
        this._closeBtn.position.set(1150, 30);
        this.addChild(this._closeBtn);
    }
    private addClearBetBtn(): void {
        this._clearBetBtn = new Button("CLEAR");
        this._clearBetBtn.position.set(850, 500);
        this.addChild(this._clearBetBtn);
        this._clearBetBtn.addEvent(this.clearBet.bind(this));
    }
    private clearBet(): void {
        GameMath.BET = 0;
        Manager.EventEmitter.emit(GameSignals.CHIPS_SELECTION);
    }
    private addChips(): void {
        for (let c = 0; c < GameMath.CHIPS.length; c++) {
            this._chips[c] = new Chip(c);
            this.addChild(this._chips[c]);
        }
    }
    public show(immediate: boolean = false): void {
        Manager.InGameMessage.showMessage("");
        if (immediate) {
            this.alpha = 1;
            this.enableBtns();
        } else {
            new Tween(this).to({ alpha: 1 }, 300).start().easing(Easing.Quadratic.Out).onComplete(() => { this.enableBtns(); });
        }
    }
    public hide(immediate: boolean = false): void {
        this.disableBtns();
        if (immediate) {
            this.alpha = 0;
            Manager.EventEmitter.emit(GameSignals.ENABLE_BET_BTN);
        } else {
            new Tween(this).to({ alpha: 0 }, 300).start().easing(Easing.Quadratic.Out).onComplete(()=>{
                Manager.EventEmitter.emit(GameSignals.ENABLE_BET_BTN);
            });
        }
    }
    private enableBtns(): void {
        this._closeBtn.interactive = true;
        this._closeBtn.on('pointertap', () => { sound.play('snd-click');this.hide() });
        this._closeBtn.cursor = 'pointer';
        this._clearBetBtn.enable();
        for(let c of this._chips){
            c.addEvents();
        }
    }
    private disableBtns(): void {
        this._closeBtn.interactive = false;
        this._closeBtn.removeAllListeners();
        this._clearBetBtn.disable();
        for(let c of this._chips){
            c.removeEvents();
        }
    }
}