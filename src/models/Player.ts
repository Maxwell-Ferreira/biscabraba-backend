import { Card } from "./Interfaces";

interface PlayerPublicData{
    name: string,
    points: number,
    team: number,
};

export default class Player{
    private id: string;
    private name: string;
    private room: string;
    private hand: Array<Card> = [];
    private actualMove: Card|null = null;
    private isTurn: boolean = false;
    private points: number = 0;
    private team: number = 0;

    constructor(id: string, name: string, room:string){
        this.id = id;
        this.name = name;
        this.room = room;
    }

    public getId():string{
        return this.id;
    }

    public getName():string{
        return this.name;
    }

    public getRoom():string{
        return this.room;
    }

    public getTeam():number {
        return this.team;
    }

    public getPublicData():PlayerPublicData{
        return {
            name: this.name,
            points: this.points,
            team: this.team
        };
    }

    public setTeam(team:number):void{
        this.team = team;
    }

    public getHand():Array<Card>{
        return this.hand;
    }

    public setHand(hand:Array<Card>):void{
        this.hand = hand;
    }

    public getIsTurn(){
        return this.isTurn;
    }

    public getActualMove():Card|null{
        return this.actualMove;
    }

    public setActualMove(card:Card|null){
        this.actualMove = card;
    }

    public removeCardOfHand(cardIndex:number){
        this.hand.slice(cardIndex, 1);
    }

    public getPoints(){
        return this.points;
    }

    public setPoints(points:number){
        this.points = points;
    }
}