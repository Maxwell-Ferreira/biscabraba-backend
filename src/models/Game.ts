import { Card, Message } from "./Interfaces";
import Player from "./Player";

export default class Game{
    private id: string;
    private status: boolean = false;
    private trump: string = '';
    private playerTurn: string = '';
    private statusAs: boolean = false;
    private round: number = 0;
    private numPlayers: number;

    private players: Array<Player> = [];
    private chat: Array<Message> = [];

    private deck: Array<Card> = [
        {name: "2", naipe: "copas", value: 0, order: 0},
        {name: "3", naipe: "copas", value: 0, order: 1},
        {name: "4", naipe: "copas", value: 0, order: 2},
        {name: "5", naipe: "copas", value: 0, order: 3},
        {name: "6", naipe: "copas", value: 0, order: 4},
        {name: "dama", naipe: "copas", value: 2, order: 5},
        {name: "valete", naipe: "copas", value: 3, order: 6},
        {name: "rei", naipe: "copas", value: 4, order: 7},
        {name: "7", naipe: "copas", value: 10, order: 8},
        {name: "as", naipe: "copas", value: 11, order: 9},
        
        {name: "2", naipe: "paus", value: 0, order: 0},
        {name: "3", naipe: "paus", value: 0, order: 1},
        {name: "4", naipe: "paus", value: 0, order: 2},
        {name: "5", naipe: "paus", value: 0, order: 3},
        {name: "6", naipe: "paus", value: 0, order: 4},
        {name: "dama", naipe: "paus", value: 2, order: 5},
        {name: "valete", naipe: "paus", value: 3, order: 6},
        {name: "rei", naipe: "paus", value: 4, order: 7},
        {name: "7", naipe: "paus", value: 10, order: 8},
        {name: "as", naipe: "paus", value: 11, order: 9},

        {name: "2", naipe: "ouros", value: 0, order: 0},
        {name: "3", naipe: "ouros", value: 0, order: 1},
        {name: "4", naipe: "ouros", value: 0, order: 2},
        {name: "5", naipe: "ouros", value: 0, order: 3},
        {name: "6", naipe: "ouros", value: 0, order: 4},
        {name: "dama", naipe: "ouros", value: 2, order: 5},
        {name: "valete", naipe: "ouros", value: 3, order: 6},
        {name: "rei", naipe: "ouros", value: 4, order: 7},
        {name: "7", naipe: "ouros", value: 10, order: 8},
        {name: "as", naipe: "ouros", value: 11, order: 9},

        {name: "2", naipe: "espadas", value: 0, order: 0},
        {name: "3", naipe: "espadas", value: 0, order: 1},
        {name: "4", naipe: "espadas", value: 0, order: 2},
        {name: "5", naipe: "espadas", value: 0, order: 3},
        {name: "6", naipe: "espadas", value: 0, order: 4},
        {name: "dama", naipe: "espadas", value: 2, order: 5},
        {name: "valete", naipe: "espadas", value: 3, order: 6},
        {name: "rei", naipe: "espadas", value: 4, order: 7},
        {name: "7", naipe: "espadas", value: 10, order: 8},
        {name: "as", naipe: "espadas", value: 11, order: 9}
    ];

    constructor(id: string, numPlayers: number) {
        this.id = id;
        this.numPlayers = numPlayers;
    }

    public getId():string{
        return this.id;
    }

}