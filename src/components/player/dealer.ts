import { Card } from "../card";
import { Player } from "./player";

export class Dealer extends Player {
    public override addCard(id:string): void {
        let card = new Card(id);
        this.cardDisplay.addCard(card  ,0);

        this.score+=card.id;
        this.scoreTF.updateScore(this.score);
    }
}