import { isArray } from "lodash";
import { Socket } from "socket.io";
import Game from "./Models/Game";

export const findGame = (games: Array<Game>, idRoom: string) => games.find(game => game.getId() === idRoom);

export const findGameIndex = (games: Array<Game>, idRoom: string) => games.findIndex(game => game.getId() === idRoom);

export const findGameIndexByPlayerId = (games: Array<Game>, playerId: string) => {
  return games.findIndex(game => {
    let player = game.getPlayers().find(player => player.getId() === playerId);

    if (player) { return player.getRoom() === game.getId(); }
  });
}

export function emitError(socket: Socket, errors: Array<any>|string) {
  if(isArray(errors)) {
    socket.emit('error', errors);
  } else {
    socket.emit('error', [{ message: errors }]);
  }
}

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
