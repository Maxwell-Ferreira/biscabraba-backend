import { getRandomInt } from "../Utils";
import { Card, Message, PlayerPublicData } from "./Interfaces";
import Player from "./Player";

export default class Game {
    private id: string;
    private status: boolean = false;
    private trump: string = '';
    private playerTurn: string = '';
    private statusAs: boolean = false;
    private numberOfPlays: number = 0;
    private numPlayers: number;

    private players: Array<Player> = [];
    private chat: Array<Message> = [];

    private naipes: Array<string> = ['copas', 'paus', 'ouros', 'espadas'];

    private deck: Array<Card> = [
        { name: "2", naipe: "copas", value: 0, order: 0 },
        { name: "3", naipe: "copas", value: 0, order: 1 },
        { name: "4", naipe: "copas", value: 0, order: 2 },
        { name: "5", naipe: "copas", value: 0, order: 3 },
        { name: "6", naipe: "copas", value: 0, order: 4 },
        { name: "dama", naipe: "copas", value: 2, order: 5 },
        { name: "valete", naipe: "copas", value: 3, order: 6 },
        { name: "rei", naipe: "copas", value: 4, order: 7 },
        { name: "7", naipe: "copas", value: 10, order: 8 },
        { name: "as", naipe: "copas", value: 11, order: 9 },

        { name: "2", naipe: "paus", value: 0, order: 0 },
        { name: "3", naipe: "paus", value: 0, order: 1 },
        { name: "4", naipe: "paus", value: 0, order: 2 },
        { name: "5", naipe: "paus", value: 0, order: 3 },
        { name: "6", naipe: "paus", value: 0, order: 4 },
        { name: "dama", naipe: "paus", value: 2, order: 5 },
        { name: "valete", naipe: "paus", value: 3, order: 6 },
        { name: "rei", naipe: "paus", value: 4, order: 7 },
        { name: "7", naipe: "paus", value: 10, order: 8 },
        { name: "as", naipe: "paus", value: 11, order: 9 },

        { name: "2", naipe: "ouros", value: 0, order: 0 },
        { name: "3", naipe: "ouros", value: 0, order: 1 },
        { name: "4", naipe: "ouros", value: 0, order: 2 },
        { name: "5", naipe: "ouros", value: 0, order: 3 },
        { name: "6", naipe: "ouros", value: 0, order: 4 },
        { name: "dama", naipe: "ouros", value: 2, order: 5 },
        { name: "valete", naipe: "ouros", value: 3, order: 6 },
        { name: "rei", naipe: "ouros", value: 4, order: 7 },
        { name: "7", naipe: "ouros", value: 10, order: 8 },
        { name: "as", naipe: "ouros", value: 11, order: 9 },

        { name: "2", naipe: "espadas", value: 0, order: 0 },
        { name: "3", naipe: "espadas", value: 0, order: 1 },
        { name: "4", naipe: "espadas", value: 0, order: 2 },
        { name: "5", naipe: "espadas", value: 0, order: 3 },
        { name: "6", naipe: "espadas", value: 0, order: 4 },
        { name: "dama", naipe: "espadas", value: 2, order: 5 },
        { name: "valete", naipe: "espadas", value: 3, order: 6 },
        { name: "rei", naipe: "espadas", value: 4, order: 7 },
        { name: "7", naipe: "espadas", value: 10, order: 8 },
        { name: "as", naipe: "espadas", value: 11, order: 9 }
    ];

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

    public getPlayerById(id: string): Player | null {
        let player = this.players.find(player => player.getId() === id)

        if (player) return player;
        else return null;
    }

    public getStatus(): boolean {
        return this.status;
    }

    private setTurn(playerName: string) {
        this.playerTurn = playerName;
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
            this.setTurn(this.players[getRandomInt(0, this.numPlayers)].getName());

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

    public getPublicData(idCurrentPlayer: string) {
        return {
            gameStatus: this.status,
            gameTrump: this.trump,
            playerTurn: this.playerTurn,
            statusAs: this.statusAs,
            numberOfPlays: this.numberOfPlays,
            currentPlayer: this.players.find(player => player.getId() === idCurrentPlayer),
            teams: this.getTeams()
        }
    }

    private defineTeams() {
        let team = 1;
        for (var player in this.players) {
            this.players[player].setTeam(team);
            if (team === 1) team = 2;
            else team = 1;
        }
    }

    private defineTrump() {
        this.trump = this.naipes[getRandomInt(0, 3)];
    }

    private giveCards() {
        for (var player in this.players) {
            for (var j = 0; j < 3; j++) {
                let num = getRandomInt(0, this.deck.length);
                this.players[player].setHand([...this.players[player].getHand(), this.deck[num]]);
                this.deck.splice(num, 1);
            }
        }
    }

    private verifySevenCard(cardIndex: number, player: Player) {
        const cardOfHand = player.getHand()[cardIndex];
        if (cardOfHand.naipe === this.trump && cardOfHand.order === 8) {
            this.statusAs = true;
        }
    }

    private verifyAsCard(cardIndex: number, player: Player) {
        const cardOfHand = player.getHand()[cardIndex];

        if (cardOfHand.naipe === this.trump && cardOfHand.order === 9 && !this.statusAs) {
            return false
        }

        return true;
    }

    public playCard(cardIndex: number, playerId: string) {
        const player = this.players.find(player => player.getId() === playerId);

        var error = '';

        if (player?.getIsTurn()) {
            this.verifySevenCard(cardIndex, player);

            if (this.verifyAsCard(cardIndex, player)) {
                const playerIndex = this.players.findIndex(player => player.getId() === playerId);
                const card = player.getHand()[cardIndex];

                player.removeCardOfHand(cardIndex);
                player.setActualMove(card);

                this.numberOfPlays++;

                //define the next player to play.
                if (playerIndex === 1 || playerIndex === 3) {
                    this.setTurn(this.players[0].getName());
                } else {
                    this.setTurn(this.players[playerIndex + 1].getName());
                }

                this.players[playerIndex] = player;

                return true;

            } else {
                error = 'A carta As de trunfo não pode sair antes da sete de trunfo.';
            }
        } else {
            error = 'Não é o turno deste jogador.';
        }

        return { error: error }
    }

    private verifyStatusPlayers() {
        for (let player of this.players) {
            if (player.getHand() === null)
                return false;
        }

        return true;
    }

    private calculateRound() {

        /*         if (this.numPlayers === 2) {
        
                    const cardPlayer1 = this.players[0].getActualMove()!;
                    const cardPlayer2 = this.players[1].getActualMove()!;
        
                    if (cardPlayer1.naipe === cardPlayer2.naipe) {
                        if (cardPlayer1.order > cardPlayer2.order) {
                            this.players[0].setPoints(this.players[0].getPoints() + (cardPlayer1.value + cardPlayer2.value));
                            this.setTurn(this.players[0].getId());
                        } else {
                            this.players[1].setPoints(this.players[1].getPoints() + (cardPlayer1.value + cardPlayer2.value));
                            this.setTurn(this.players[1].getId());
                        }
                    } else {
                        if (cardPlayer1.naipe === this.trump) {
                            this.players[0].setPoints(this.players[0].getPoints() + (cardPlayer1.value + cardPlayer2.value));
                            this.setTurn(this.players[0].getId());
                        } else if (cardPlayer2.naipe === this.trump) {
                            this.players[1].setPoints(this.players[1].getPoints() + (cardPlayer1.value + cardPlayer2.value));
                            this.setTurn(this.players[1].getId());
                        } else {
                            if (this.players[0].getId() === this.playerTurn) {
                                this.players[0].setPoints(this.players[0].getPoints() + (cardPlayer1.value + cardPlayer2.value));
                                this.setTurn(this.players[0].getId());
                            } else {
                                this.players[1].setPoints(this.players[1].getPoints() + (cardPlayer1.value + cardPlayer2.value));
                                this.setTurn(this.players[1].getId());
                            }
                        }
                    }
                } else if (this.numPlayers === 4) {
        
                    const cardPlayer1 = this.players[0].getActualMove()!;
                    const cardPlayer2 = this.players[1].getActualMove()!;
                    const cardPlayer3 = this.players[2].getActualMove()!;
                    const cardPlayer4 = this.players[3].getActualMove()!;
        
                    if (cardPlayer1.naipe === cardPlayer2.naipe && cardPlayer1.naipe === cardPlayer3.naipe && cardPlayer1.naipe === cardPlayer4.naipe) {
                        if (cardPlayer1.order > cardPlayer2.order && cardPlayer1.order > cardPlayer3.order && cardPlayer1.order > cardPlayer4.order) {
                            this.players[0].setPoints(this.players[0].getPoints() + (cardPlayer1.value + cardPlayer2.value + cardPlayer3.value + cardPlayer4.value));
                            this.setTurn(this.players[0].getId());
                        }
                        else if (cardPlayer2.order > cardPlayer1.order && cardPlayer2.order > cardPlayer3.order && cardPlayer2.order > cardPlayer4.order) {
                            this.players[1].setPoints(this.players[1].getPoints() + (cardPlayer1.value + cardPlayer2.value + cardPlayer3.value + cardPlayer4.value));
                            this.setTurn(this.players[1].getId());
                        }
                        else if (cardPlayer3.order > cardPlayer1.order && cardPlayer3.order > cardPlayer2.order && cardPlayer3.order > cardPlayer4.order) {
                            this.players[2].setPoints(this.players[2].getPoints() + (cardPlayer1.value + cardPlayer2.value + cardPlayer3.value + cardPlayer4.value));
                            this.setTurn(this.players[2].getId());
                        } else {
                            this.players[3].setPoints(this.players[3].getPoints() + (cardPlayer1.value + cardPlayer2.value + cardPlayer3.value + cardPlayer4.value));
                            this.setTurn(this.players[3].getId());
                        }
                    } else if (cardPlayer1.naipe === this.trump || cardPlayer2.naipe === this.trump || cardPlayer3.naipe === this.trump || cardPlayer3.naipe === this.trump) { */

        let indexWinnerOfRound = '';
        let pointsOfTurn = 0;

        for (let player in this.players) {
            for (let playerCompare in this.players) {
                if (!(player === playerCompare)) {
                    if (this.players[player].getActualMove()?.naipe === this.players[playerCompare].getActualMove()?.naipe) {
                        if (!this.players[player].getActualMove()?.order > !this.players[player].getActualMove()?.order) {
                            indexWinnerOfRound = player;
                        } else {
                            indexWinnerOfRound = playerCompare;
                        }
                    } else {
                        if (this.players[player].getActualMove()?.naipe === this.trump) {
                            indexWinnerOfRound = player;
                        } else if (this.players[playerCompare].getActualMove()?.naipe === this.trump) {
                            indexWinnerOfRound = playerCompare;
                        } else {
                            if (this.players[player].getId() === this.playerTurn) {
                                indexWinnerOfRound = player;
                            } else {
                                indexWinnerOfRound = playerCompare;
                            }
                        }
                    }
                }
            }

            pointsOfTurn += this.players[player].getPoints();
        }

        this.players[Number(indexWinnerOfRound)].setPoints(this.players[Number(indexWinnerOfRound)].getPoints() + pointsOfTurn);
        //}
        //}
    }

    private buyCards() {
        for (let p in this.players) {
            let deckIndex = getRandomInt(0, this.deck.length);

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
        }
    }

    public end(){
        for(let player of this.players){
            if(player.getHand().length > 0){
                return false;
            }
        }

        return true;
    }

    public getWinner(){
        let pointsTeam1 = 0;
        let pointsTeam2 = 0;

        for(let player of this.players){
            if(player.getTeam() === 1)
                pointsTeam1 += player.getPoints();
            else
                pointsTeam2 += player.getPoints();
        }

        if(pointsTeam1 > pointsTeam2) return this.getTeam(1);
        else return this.getTeam(2);
    }

    public getTeam(numTeam:number){
        let team: Array<Player> = [];

        for(let player of this.players){
            if(player.getTeam() === numTeam)
                team.push(player);
        }

        return team;

    }
}
