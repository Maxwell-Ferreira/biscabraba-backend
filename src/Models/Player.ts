import { Card, PlayerPublicData } from "./Interfaces";

export default class Player {
  private id: string;
  private publicId: number;
  private name: string;
  private room: string;
  private hand: Array<Card> = [];
  private actualMove: Card | null = null;
  private isTurn: boolean = false;
  private points: number = 0;
  private team: number = 0;
  private avatar: number;
  private lastMoveTime: number;

  constructor(id: string, name: string, room: string, avatar: number) {
    this.id = id;
    this.name = name;
    this.room = room;
    this.avatar = avatar;
    this.publicId = new Date().getTime();
    this.lastMoveTime = this.publicId;
  }

  public getId(): string {
    return this.id;
  }

  public getPublicId() {
    return this.publicId;
  }

  public getName(): string {
    return this.name;
  }

  public getRoom(): string {
    return this.room;
  }

  public getTeam(): number {
    return this.team;
  }

  public getPublicData(): PlayerPublicData {
    return {
      publicId: this.publicId,
      name: this.name,
      avatar: this.avatar,
      points: this.points,
      team: this.team,
      numCards: this.hand.length,
      actualMove: this.actualMove
    };
  }

  public setTeam(team: number): void {
    this.team = team;
  }

  public getHand(): Array<Card> {
    return this.hand;
  }

  public setHand(hand: Array<Card>): void {
    this.hand = hand;
  }

  public getIsTurn() {
    return this.isTurn;
  }

  public getActualMove(): Card | null {
    return this.actualMove;
  }

  public setActualMove(card: Card | null) {
    this.actualMove = card;
  }

  public removeCardOfHand(card: Card) {
    const cardIndex = this.hand.findIndex(c => c.id === card.id);
    
    this.hand.splice(cardIndex, 1);
  }

  public getPoints() {
    return this.points;
  }

  public addPoints(points: number) {
    this.points += points;
  }

  public getCardOfHand(cardId: number) {
    const card = this.hand.find(card => card.id === cardId);
    
    return card;
  }

  public getLastMoveTime() : number {
    return this.lastMoveTime
  }

  public setLastMoveTime() {
    this.lastMoveTime = new Date().getTime();
  }
}