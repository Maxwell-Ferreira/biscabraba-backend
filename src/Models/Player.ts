import { Card, PlayerPublicData } from "./Interfaces";

export default class Player {
  publicId: number;
  hand: Array<Card> = [];
  actualMove: Card | null = null;
  isTurn: boolean = false;
  points: number = 0;
  team: number = 0;
  lastMoveTime: number;

  constructor(
    public id: string,
    public name: string,
    public room: string,
    public avatar: number
  ) {
    this.publicId = new Date().getTime();
    this.lastMoveTime = this.publicId;
  }

  public getPublicData(): PlayerPublicData {
    return {
      publicId: this.publicId,
      name: this.name,
      avatar: this.avatar,
      points: this.points,
      team: this.team,
      numCards: this.hand.length,
      actualMove: this.actualMove,
    };
  }

  public removeCardOfHand(card: Card) {
    const cardIndex = this.hand.findIndex((c) => c.id === card.id);

    this.hand.splice(cardIndex, 1);
  }

  public addPoints(points: number) {
    this.points += points;
  }

  public getCardOfHand(cardId: number) {
    const card = this.hand.find((card) => card.id === cardId);

    return card;
  }

  public setLastMoveTime() {
    this.lastMoveTime = new Date().getTime();
  }
}
