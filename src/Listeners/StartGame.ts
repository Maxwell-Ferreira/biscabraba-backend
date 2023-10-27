import Game from "../Models/Game";
import { ListenerProps } from "../Types/ListenerProps";

const startGame = async ({ io, socket, games }: ListenerProps) => {
  const game = Game.findByPlayerId(games, socket.id);
  if (!game) {
    throw new Error("Socket não conectado à nenhuma sala.");
  }

  game.initialize();

  for (const player of game.getPlayers()) {
    io.to(player.getId()).emit("startGame", game.getPublicData(player.getId()));
  }
};

export default startGame;
