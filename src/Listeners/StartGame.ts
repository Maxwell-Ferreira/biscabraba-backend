import { Socket } from "socket.io";
import Game from "../Models/Game";
import { emitError,findGameIndexByPlayerId } from "../Utils";

const startGame = async (io:any, socket:Socket, games:Array<Game>) => {
  const gameIndex = findGameIndexByPlayerId(games, socket.id);
  if (gameIndex === -1) { return emitError(socket, 'Socket não conectado à nenhuma sala.'); }

  const game = games[gameIndex];
  if (!game.initialize()) { return emitError(socket, 'Ainda faltam jogadores para a partida ser iniciada.'); }

  game.getPlayers().forEach(player => {
    game.getPublicData(player.getId());
    io.to(player.getId()).emit('startGame', game.getPublicData(player.getId()));
  });

  games[gameIndex] = game;
}

export default startGame;