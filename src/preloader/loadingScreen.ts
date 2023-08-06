import { Container, Graphics, Assets } from "pixi.js";
import { manifest } from "../../static/assets/assets";
import { MainScene } from "../scene/mainScene";
import { IScene, Manager } from "../scene/sceneManager";

export class LoaderScene extends Container implements IScene{
    private _loaderBar: Container;
    private _loaderBarBoder: Graphics;
    private _loaderBarFill: Graphics;
    constructor() {
        super();
        const loaderBarWidth = Manager.width * 0.8; 
        this._loaderBarFill = new Graphics();
        this._loaderBarFill.beginFill(0x0ac90b, 1)
        this._loaderBarFill.drawRect(0, 0, loaderBarWidth, 100);
        this._loaderBarFill.endFill();
        this._loaderBarFill.scale.x = 0;

        this._loaderBarBoder = new Graphics();
        this._loaderBarBoder.lineStyle(10, 0x000000, 1);
        this._loaderBarBoder.drawRect(0, 0, loaderBarWidth, 100);

        this._loaderBar = new Container();
        this._loaderBar.addChild(this._loaderBarFill);
        this._loaderBar.addChild(this._loaderBarBoder);
        this._loaderBar.position.x = (Manager.width - this._loaderBar.width) / 2; 
        this._loaderBar.position.y = (Manager.height - this._loaderBar.height) / 2;
        this.addChild(this._loaderBar);

        this.initializeLoader().then(() => {
            this.gameLoaded();
        })
    }

    private async initializeLoader(): Promise<void> {
        await Assets.init({ manifest: manifest });
        const bundleIds =  manifest.bundles.map(bundle => bundle.name);
        await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
    }

    private downloadProgress(progressRatio: number): void {
        this._loaderBarFill.scale.x = progressRatio;
    }

    private gameLoaded(): void {
        Manager.transitionScene(new MainScene);
    }
    update(framesPassed: number): void {
        framesPassed
    }
}