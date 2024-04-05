import Game from "../Models/Game";
import { ListenerProps } from "../Types/ListenerProps";

const disconnect = async ({ io, socket, games }: ListenerProps) => {
  console.log(`Socket disconnected -> id: ${socket.id}`);

  const game = Game.findByPlayerId(games, socket.id);
  if (!game) return;

  const gameId = game.id;

  if (game.status || game.actualNumPlayers === 1) {
    const player = game.getPlayerById(socket.id)!;
    const gameIndex = games.findIndex((game) => game.id === gameId);
    games.splice(gameIndex, 1);

    io.to(gameId).emit(
      "game-player-disconected",
      `${player.name} foi desconectado! A partida foi encerrada.`
    );

    return;
  }

  game.removePlayer(socket.id);
  io.to(gameId).emit("room-playerDisconnected", game.getPublicData());

  return;
};

export default disconnect;
