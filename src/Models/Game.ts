import { getRandomInt } from "../Utils";
import { deck } from "./Deck";
import { Card, Message, PlayerPublicData } from "./Interfaces";
import Player from "./Player";

export default class Game {
  private id: string;
  private status: boolean = false;
  private trump: string = '';
  private playerTurn: number|null = null;
  private statusAs: boolean = false;
  private numberOfPlays: number = 0;
  private numPlayers: number;
  private turnPlay: number = 0;
  private numberOfGames: number = 0;
  private players: Array<Player> = [];
  private chat: Array<Message> = [];

  private naipes: Array<string> = ['copas', 'paus', 'ouros', 'espadas'];

  private deck: Array<Card> = deck;

  constructor(id: string, numPlayers: number) {
    this.id = id;
    this.numPlayers = numPlayers;
  }

  public getId(): string {
    return this.id;
  }

  public getPlayers(): Array<Player> {
    return this.players;
  }

  public getNumPlayers(): number {
    return this.numPlayers;
  }

  public getActualNumPlayers(): number {
    return this.players.length;
  }

  public getPlayersPublicData(): Array<PlayerPublicData> {
    return this.getPlayers().map(player => player.getPublicData())
  }

  static find(games: Game[], id: string) {
    return games.find((game) => game.getId() === id);
  }

  public getPlayerById(id: string): Player | null {
    let player = this.players.find(player => player.getId() === id)

    if (player) return player;
    else return null;
  }

  public getStatus(): boolean {
    return this.status;
  }

  private setTurn(publicId: number) {
    this.playerTurn = publicId;
  }

  public addNewPlayer(player: Player): void {
    this.players.push(player);
  }

  public initialize() {
    if (this.players.length === this.numPlayers) {
      this.status = true;

      this.defineTeams();
      this.defineTrump();
      this.giveCards();
      this.setTurn(this.players[getRandomInt(0, this.numPlayers)].getPublicId());

      return true;
    }

    return false
  }

  public getTeams() {
    let team1 = {
      team: 1,
      players: this.players.filter(player => player.getTeam() === 1).map(player => player.getPublicData())
    }

    let team2 = {
      team: 2,
      players: this.players.filter(player => player.getTeam() === 2).map(player => player.getPublicData())
    }

    return [team1, team2];
  }

  public getPublicData(idCurrentPlayer: string | null = null) {
    return {
      idRoom: this.id,
      gameStatus: this.status,
      numPlayers: this.numPlayers,
      gameTrump: this.trump,
      playerTurn: this.playerTurn,
      statusAs: this.statusAs,
      numberOfPlays: this.numberOfPlays,
      currentPlayer: idCurrentPlayer ? this.players.find(player => player.getId() === idCurrentPlayer) : null,
      players: this.players.map(p => p.getPublicData()),
      teams: this.getTeams(),
      numberOfCardsInDeck: this.deck.length
    }
  }

  private defineTeams() {
    let team = 1;
    this.players.forEach((p, i) => {
      this.players[i].setTeam(team);
      team = team === 1 ? 2 : 1;
    });
  }

  private defineTrump() {
    this.trump = this.naipes[getRandomInt(0, 3)];
  }

  private giveCards() {
    for (var player in this.players) {
      for (var j = 0; j < 3; j++) {
        let num = getRandomInt(0, (this.deck.length - 1));
        
        this.players[player].setHand([...this.players[player].getHand(), this.deck[num]]);
        this.deck.splice(num, 1);
      }
    }
  }

  private verifySevenCard(card: Card) {
    if (card.naipe === this.trump && card.order === 8) {
      if (this.turnPlay === 4) { return false; }
      this.statusAs = true;
    }

    return true;
  }

  private verifyAsCard(card: Card) {
    if (card.naipe === this.trump && card.order === 9 && !this.statusAs) {
      return false;
    }

    return true;
  }

  public playCard(cardId: number, playerId: string) {
    const player = this.players.find(player => player.getId() === playerId);

    if (!player) { return { error: 'Jogador não encontrado' }; }
    else {
      if (!(player.getPublicId() === this.playerTurn)) { return { error: 'Não é o turno deste jogador.' }; }

      const card = player.getCardOfHand(cardId);
      if (!card) { return { error: 'Carta não está na mão do jogador.' }; }

      if (!this.verifySevenCard(card)) { return { error: 'O 7 de trunfo ainda não pode sair de canto.' }; }
      if (!this.verifyAsCard(card)) { return { error: 'O Ás de trunfo não pode sair antes da 7 de trunfo.' }; }

      player.removeCardOfHand(card);
      player.setActualMove(card);

      this.numberOfPlays++;

      const playerIndex = this.players.findIndex(player => player.getId() === playerId);
      const nextPlayer = this.players[playerIndex + 1] || this.players[0];

      console.log(this.players);

      this.setTurn(nextPlayer.getPublicId());
      player.setLastMoveTime();

      return true;
    }
  }

  private verifyStatusPlayers() {
    for (let player of this.players) {
      if (player.getActualMove() === null)
        return false;
    }

    return true;
  }

  private calculateRound() {

    const winner = this.players.reduce((prev, curr) => {
      if (prev.getId() === curr.getId()) return curr;

      const prevMove = prev.getActualMove();
      const currMove = curr.getActualMove();

      if (prevMove && currMove) {
        if (prevMove.naipe === currMove.naipe) {
          if (prevMove.order > currMove.order) return prev;
          else return curr;
        }
        else {
          if (prevMove.naipe === this.trump) return prev;
          else if (currMove.naipe === this.trump) return curr;
          else {
            if (prev.getLastMoveTime() < curr.getLastMoveTime()) prev;
            else return curr;
          }
        }
      }

      return prev;
    }, this.players[0]);

    let points = 0;
    this.players.forEach(p => { points += (p.getActualMove()?.value || 0); });

    winner.addPoints(points);
    this.setTurn(winner.getPublicId());
  }

  private buyCards() {
    for (let p in this.players) {
      let deckIndex = getRandomInt(0, (this.deck.length - 1));

      let oldHand = this.players[p].getHand();
      let newHand = [...oldHand, this.deck[deckIndex]];

      this.players[p].setHand(newHand);
      this.players[p].setActualMove(null);

      this.deck.splice(deckIndex, 1);
    }
  }

  public verifyRoundCompleted() {
    if (this.verifyStatusPlayers()) {
      this.calculateRound();

      if (this.deck.length > 0) {
        this.buyCards();
      }

      return true;
    }

    return false;
  }

  public end() {
    for (let player of this.players) {
      if (player.getHand().length > 0) {
        return false;
      }
    }

    this.numberOfGames++;

    return true;
  }

  public getWinner() {
    let pointsTeam1 = 0;
    let pointsTeam2 = 0;

    for (let player of this.players) {
      if (player.getTeam() === 1)
        pointsTeam1 += player.getPoints();
      else
        pointsTeam2 += player.getPoints();
    }

    if (pointsTeam1 > pointsTeam2) return this.getTeam(1);
    else return this.getTeam(2);
  }

  public getTeam(numTeam: number) {
    let team: Array<Player> = [];

    for (let player of this.players) {
      if (player.getTeam() === numTeam)
        team.push(player);
    }

    return team;
  }

  public removePlayer(socketId: string) {
    const playerIndex = this.players.findIndex(p => p.getId() === socketId);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }
  }

  public addMessage(text: string, player: string) {
    this.chat.push({ text, player });

    return this.chat.length - 1;
  }
}
