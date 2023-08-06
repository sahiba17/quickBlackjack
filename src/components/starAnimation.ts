import { Container,  Sprite } from "pixi.js";
import { Tween } from "tweedle.js";

export class StarAnimation extends Container {
    private _anims: Sprite[] = [];
    private _spawnX = [-640, 640];
    private _spawnY = [-360, 360];
    constructor() {
        super();
        this.addStars();
        this.animateStars();
    }
    private addStars(): void {
        for (let i = 0; i < 15; i++) {
            this._anims[i] = Sprite.from('star');
            this._anims[i].anchor.set(0.5);
            this._anims[i].scale.set(Math.random() / 10);
            this._anims[i].position.set(this.randomIntInRange(this._spawnX[0], this._spawnX[1]), this.randomIntInRange(this._spawnY[0], this._spawnY[1])); // almost bottom-left corner of the canvas
            this._anims[i].alpha = Math.random() ;
            this._anims[i].angle = this.randomIntInRange(0, 360);
            this.addChild(this._anims[i]);
        }
    }
    private randomIntInRange(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private animateStars(): void {
        for (let anim of this._anims) {
            let dur = this.randomIntInRange(100, 800)
            new Tween(anim.scale).to({ x: 0, y: 0 }, dur).yoyo(true).repeat(Infinity).start();
            new Tween(anim).to({alpha : 0}, dur).yoyo(true).repeat(Infinity).start();//.onUpdate((obj:Sprite)=>{obj.angle++;});
        }
    }
}