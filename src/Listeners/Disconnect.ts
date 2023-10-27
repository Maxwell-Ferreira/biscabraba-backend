import Game from "../Models/Game";
import { ListenerProps } from "../Types/ListenerProps";

const disconnect = async ({ io, socket, games }: ListenerProps) => {
  const game = Game.findByPlayerId(games, socket.id);

  console.log(`Socket disconnected -> id: ${socket.id}`);

  if (!game) return;

  const gameId = game.getId();

  if (game.getStatus() || game.getActualNumPlayers() === 1) {
    const player = game.getPlayerById(socket.id)!;

    const gameIndex = games.findIndex((game) => game.getId() === gameId);

    io.to(gameId).emit(
      "game-player-disconected",
      `${player.getName()} foi desconectado! A partida foi encerrada.`
    );
    games.splice(gameIndex, 1);
  } else {
    game.removePlayer(socket.id);
    io.to(gameId).emit("room-playerDisconnected", game.getPublicData());
  }
};

export default disconnect;
