import { Application, DisplayObject } from "pixi.js";
import { Tween } from "tweedle.js";
import { utils } from "pixi.js";
import { InGameMessage } from "../components/inGameMsg";
// import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";
// import Flip from "gsap/Flip";


export class Manager {
    private constructor() {}

    private static _app: Application;
    private static _currentScene: IScene;

    private static _width: number;
    private static _height: number;

    public static get width(): number {
        return Manager._width;
    }
    public static get height(): number {
        return Manager._height;
    }
    public static InGameMessage = new InGameMessage();
    public static EventEmitter = new utils.EventEmitter();

    public static initialize(width: number, height: number, background: number): void {
        Manager._width = width;
        Manager._height = height;

        Manager._app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height
        });

        Manager._app.ticker.add(Manager.update)

        window.addEventListener("resize", Manager.resize);

        // gsap.registerPlugin(ScrollTrigger, Draggable, Flip, MotionPathPlugin); 

        Manager.resize();
    }

    public static changeScene(newScene: IScene): void {
        if (Manager._currentScene) {
            Manager._app.stage.removeChild(Manager._currentScene);
            Manager._currentScene.destroy();
        }
        Manager._currentScene = newScene;
        Manager._app.stage.addChild(Manager._currentScene);
    }
    public static transitionScene(newScene: IScene): void {
        if (Manager._currentScene) {
            new Tween(Manager._currentScene).to({ alpha: 0 }, 800).onComplete(() => {
                Manager._app.stage.removeChild(Manager._currentScene);
                Manager._currentScene.destroy();
                Manager._currentScene = newScene;
                Manager._app.stage.addChild(Manager._currentScene);
            }).start();
        }
    }

    private static update(framesPassed: number): void {
        if (Manager._currentScene) {
            Manager._currentScene.update(framesPassed);
        }
    }
    public static resize(): void {
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        const scale = Math.min(screenWidth / Manager.width, screenHeight / Manager.height);

        const enlargedWidth = Math.floor(scale * Manager.width);
        const enlargedHeight = Math.floor(scale * Manager.height);

        if (Manager._app.view.style) {
            Manager._app.view.style.width = `${enlargedWidth}px`;
            Manager._app.view.style.height = `${enlargedHeight}px`;
        }
    }
}

export interface IScene extends DisplayObject {
    update(framesPassed: number): void;
}