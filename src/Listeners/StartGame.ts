import Game from "../Models/Game";
import { ListenerProps } from "../Types/ListenerProps";

const startGame = async ({ io, socket, games }: ListenerProps) => {
  const game = Game.findByPlayerId(games, socket.id);
  if (!game) {
    throw new Error("Socket não conectado à nenhuma sala.");
  }

  game.initialize();

  for (const p of game.players) {
    io.to(p.id).emit("startGame", game.getPublicData(p.id));
  }
};

export default startGame;
