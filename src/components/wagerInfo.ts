import { Container } from "pixi.js";
import { GameMath } from "../math/gameMath";
import { Manager } from "../scene/sceneManager";
import { GameSignals } from "../signals/gameSignals";
import { sound } from "@pixi/sound";
import { MeterDisplay } from "./player/meterDisplay";
import { CreditsDisplay } from "./creditsDisplay";

export class WagerInfo extends Container {
    protected betDisplay: MeterDisplay;
    protected balanceDisplay: CreditsDisplay;

    constructor() {
        super();
        this.addChild(this.betDisplay = new MeterDisplay("BET"));
        this.addChild(this.balanceDisplay = new CreditsDisplay("BALANCE"));
        this.betDisplay.position.set(1010, 450);
        this.balanceDisplay.position.set(1010, 600);

        this.updateWagerInfo();
        this.addEventHandlers();
    }
    private addEventHandlers(): void {
        Manager.EventEmitter.addListener(GameSignals.CHIPS_SELECTION, (this.updateWagerInfo.bind(this)));
        Manager.EventEmitter.addListener(GameSignals.ENABLE_BET_BTN, (this.enableButtons.bind(this)));
        Manager.EventEmitter.addListener(GameSignals.DISABLE_BET_BTN, (this.disableButtons.bind(this)));
    }
    public enableButtons(): void {
        this.betDisplay.interactive = true;
        this.betDisplay.on('pointertap', this.onBetClick, this);
        this.betDisplay.on('pointerenter', this.onBetHover, this);
        this.betDisplay.on('pointerleave', this.onBetHoverOut, this);
        this.betDisplay.cursor = 'pointer';
    }
    public disableButtons(): void {
        this.betDisplay.interactive = false;
        this.betDisplay.removeAllListeners();
        this.betDisplay.cursor = 'default';
    }
    private onBetClick(): void {
        sound.play('snd-click');
        Manager.EventEmitter.emit(GameSignals.DISABLE_BET_BTN);
        this.onBetHoverOut();
        Manager.EventEmitter.emit(GameSignals.BET_CLICKED);
    }
    private onBetHover(): void {
        this.betDisplay.alpha = 0.80;
    }
    private onBetHoverOut(): void {
        this.betDisplay.alpha = 1;
    }
    public updateWagerInfo(): void {
        sound.play('snd-rollup');
        this.betDisplay.updateMeter(GameMath.BET);
        this.balanceDisplay.updateMeter(GameMath.BALANCE);
    }
    public CHIP_SELECTION_SIGNAL(): void {
        this.updateWagerInfo();
    }

}