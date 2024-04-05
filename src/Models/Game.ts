import { getRandomInt } from "../Utils";
import { deck } from "./Deck";
import { Card, Message, PlayerPublicData } from "./Interfaces";
import Player from "./Player";

export default class Game {
  status: boolean = false;
  trump: string = "";
  playerTurn: number | null = null;
  statusAs: boolean = false;
  numberOfPlays: number = 0;
  turnPlay: number = 0;
  numberOfGames: number = 0;
  players: Array<Player> = [];
  chat: Array<Message> = [];

  turnCardWin: Card | null = null;

  naipes: Array<string> = ["copas", "paus", "ouros", "espadas"];

  deck: Array<Card> = deck;

  constructor(public id: string, public numPlayers: number) {}

  static find(games: Game[], id: string) {
    return games.find((game) => game.id === id);
  }

  static findOrFail(games: Game[], id: string) {
    const game = Game.find(games, id);
    if (!game) throw new Error("Sala não encontrada");

    return game;
  }

  static findByPlayerId(games: Game[], playerId: string) {
    return games.find((game) => {
      const player = game.players.find((player) => player.id === playerId);
      return player?.room === game.id;
    });
  }

  public get actualNumPlayers(): number {
    return this.players.length;
  }

  public getPlayersPublicData(): Array<PlayerPublicData> {
    return this.players.map((player) => player.getPublicData());
  }

  public getPlayerById(id: string): Player | null {
    return this.players.find((player) => player.id === id) || null;
  }

  private setTurn(publicId: number) {
    this.playerTurn = publicId;
  }

  public addNewPlayer(player: Player): void {
    this.players.push(player);
  }

  public initialize() {
    if (this.actualNumPlayers !== this.numPlayers) {
      throw new Error("Ainda faltam jogadores para a partida ser iniciada.");
    }

    this.status = true;

    this.defineTeams();
    this.defineTrump();
    this.giveCards();
    this.setTurn(this.players[getRandomInt(0, this.numPlayers)].publicId);
  }

  public getTeams() {
    let team1 = {
      team: 1,
      players: this.players
        .filter((player) => player.team === 1)
        .map((player) => player.getPublicData()),
    };

    let team2 = {
      team: 2,
      players: this.players
        .filter((player) => player.team === 2)
        .map((player) => player.getPublicData()),
    };

    return [team1, team2];
  }

  public getPublicData(currentPlayerId: string | null = null) {
    const currentPlayer = currentPlayerId
      ? this.players.find((player) => player.id === currentPlayerId)
      : null;

    return {
      idRoom: this.id,
      gameStatus: this.status,
      numPlayers: this.numPlayers,
      gameTrump: this.trump,
      playerTurn: this.playerTurn,
      statusAs: this.statusAs,
      numberOfPlays: this.numberOfPlays,
      currentPlayer,
      players: this.players.map((p) => p.getPublicData()),
      teams: this.getTeams(),
      numberOfCardsInDeck: this.deck.length,
    };
  }

  private defineTeams() {
    let team = 1;
    for (const player of this.players) {
      player.team = team;
      team = team === 1 ? 2 : 1;
    }
  }

  private defineTrump() {
    this.trump = this.naipes[getRandomInt(0, 3)];
  }

  private giveCards() {
    for (const player of this.players) {
      for (let i = 0; i < 3; i++) {
        const num = getRandomInt(0, this.deck.length - 1);
        player.hand = [...player.hand, this.deck[num]];
        this.deck.splice(num, 1);
      }
    }
  }

  private verifySevenCard(card: Card) {
    if (card.naipe === this.trump && card.order === 8) {
      if (this.turnPlay === 4) {
        throw new Error(
          "A 7 do trunfo não pode ser a última carta jogada na rodada."
        );
      }

      this.statusAs = true;
    }
  }

  private verifyAceCard(card: Card) {
    if (card.naipe === this.trump && card.order === 9 && !this.statusAs) {
      throw new Error("O Ás de trunfo não pode sair antes da 7 de trunfo.");
    }
  }

  private verifyTurnCardWin(card: Card) {
    if (!this.turnCardWin) {
      this.turnCardWin = card;
    } else {
      if (card.naipe === this.turnCardWin.naipe) {
        if (card.order > this.turnCardWin.order) {
          this.turnCardWin = card;
        }
      } else if (card.naipe === this.trump) {
        this.turnCardWin = card;
      }
    }
  }

  public playCard(cardId: number, playerId: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error("Jogador não encontrado");
    }

    if (!(player.publicId === this.playerTurn)) {
      throw new Error("Não é o turno deste jogador.");
    }

    const card = player.getCardOfHand(cardId);
    if (!card) throw new Error("Carta não está na mão do jogador.");

    this.verifySevenCard(card);
    this.verifyAceCard(card);

    player.removeCardOfHand(card);
    player.actualMove = card;

    this.verifyTurnCardWin({ ...card, playerId: player.id });

    this.numberOfPlays++;

    const playerIndex = this.players.findIndex((p) => p.id === playerId);
    const nextPlayer = this.players[playerIndex + 1] || this.players[0];

    this.setTurn(nextPlayer.publicId);
    player.setLastMoveTime();

    return true;
  }

  private verifyStatusPlayers() {
    return !this.players.find((p) => p.actualMove === null);
  }

  private calculateRound() {
    const winner = this.players.find(
      (p) => p.id === this.turnCardWin?.playerId
    );

    if (!winner) {
      throw new Error("Não há um vencedor.");
    }

    let points = 0;
    for (const player of this.players) {
      points += player.actualMove?.value || 0;
    }

    winner.addPoints(points);
    this.setTurn(winner.publicId);
    this.turnCardWin = null;
  }

  private buyCards() {
    for (const player of this.players) {
      const deckIndex = getRandomInt(0, this.deck.length - 1);
      const newCard = this.deck[deckIndex];

      player.hand = [...player.hand, newCard];
      player.actualMove = null;

      this.deck.splice(deckIndex, 1);
    }
  }

  public verifyRoundCompleted() {
    if (!this.verifyStatusPlayers()) {
      return false;
    }

    this.calculateRound();

    if (this.deck.length > 0) {
      this.buyCards();
    }

    return true;
  }

  public end() {
    for (const player of this.players) {
      if (player.hand.length > 0) {
        return false;
      }
    }

    this.numberOfGames++;
    return true;
  }

  public getWinner() {
    let team1Points = 0;
    let team2Points = 0;

    for (const player of this.players) {
      if (player.team === 1) team1Points += player.points;
      else team2Points += player.points;
    }

    if (team1Points > team2Points) return this.getTeam(1);
    else return this.getTeam(2);
  }

  public getTeam(numTeam: number) {
    return this.players.filter((p) => p.team === numTeam);
  }

  public removePlayer(socketId: string) {
    const playerIndex = this.players.findIndex((p) => p.id === socketId);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }
  }

  public addMessage(text: string, player: string) {
    this.chat.push({ text, player });
    return this.chat.length;
  }
}
