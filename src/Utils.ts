import { Socket } from "socket.io";
import Game from "./models/Game";


export const findGame = (games: Array<Game>, idRoom: string) => games.find(game => game.getId() === idRoom);

export const findGameIndex = (games: Array<Game>, idRoom: string) => games.findIndex(game => game.getId() === idRoom);

export const findGameIndexByPlayerId = (games: Array<Game>, playerId: string) => {
    return games.findIndex(game => {
        let player = game.getPlayers().find(player => player.getId() === playerId);

        if(player)
            return player.getRoom() === game.getId();
    });
}

export function emitError(socket:Socket, msg:string){
    socket.emit('msg', { type: 'error', text: msg });
}

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
