import { Socket } from "socket.io";
import Game from "../Models/Game";
import { findGameIndexByPlayerId } from "../Utils";

const disconnect = async (io: any, socket: Socket, games: Array<Game>) => {
  const gameIndex = findGameIndexByPlayerId(games, socket.id);

  if (gameIndex !== -1) {
    const game = games[gameIndex];

    if (game.getStatus() || game.getActualNumPlayers() === 1) {
      io.to(game.getId()).emit('game-playerDisconnected', `${game.getPlayerById(socket.id)?.getName()} foi desconectado! A partida foi encerrada.`);
      games.splice(gameIndex, 1);
    } else {
      game.removePlayer(socket.id);
      io.to(game.getId()).emit('room-playerDisconnected', game.getPublicData());
    }
  }

  console.log(`Socket disconnected -> id: ${socket.id}`);
};

export default disconnect;