import { Card } from "./Interfaces";

export default class Player{
    private id : number;
    private name: string;
    private hand: Array<Card> = [];
    private actualMove: Card = null!;
    private isTurn: boolean = false;
    private points: number = 0;
    private team: number = 0;

    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }
}