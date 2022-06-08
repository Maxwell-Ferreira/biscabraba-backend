import { Socket } from "socket.io";
import Game from "../Models/Game";
import playCardRules from "../Rules/PlayCardRules";
import { emitError, findGameIndexByPlayerId } from "../Utils";
import Validator from "../Validator";

const playCard = async (io: any, socket: Socket, games: Array<Game>, props: any) => {
  const data = await Validator.validate(props, playCardRules());
  if (!data) { return emitError(socket, 'Dados inválidos.'); }

  const play = data.cardPlayed;

  const gameIndex = findGameIndexByPlayerId(games, socket.id);
  if (gameIndex === -1) { return emitError(socket, 'Socket não conectado à nenhuma sala.'); }

  const game = games[gameIndex];

  const playResult = game.playCard(play, socket.id);
  if (playResult !== true) { return emitError(socket, playResult.error); }

  game.getPlayers().forEach(player => {
    io.to(player.getId()).emit('updateGameData', game.getPublicData(player.getId()));
  });

  game.verifyRoundCompleted();

  game.getPlayers().forEach(player => {
    io.to(player.getId()).emit('updateGameData', game.getPublicData(player.getId()));
  });

  if (game.end()) { io.to(game.getId()).emit("winnerTeam", game.getWinner()); }

  games[gameIndex] = game;
}

export default playCard;