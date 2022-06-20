import { Socket } from "socket.io";
import Game from "../Models/Game";
import { enterProps } from "../Models/Interfaces";
import Player from "../Models/Player";
import EnterRoomRules from "../Rules/EnterRoomRules";
import { emitError, findGameIndex } from "../Utils";
import Validator from "../Validator";

const enterRoom = async (socket:Socket, games:Array<Game>, props:any) => {

  const data = await Validator.validate(props, EnterRoomRules) as enterProps;
  if (data?.errors) { return emitError(socket, data?.errors); }

  const gameIndex = findGameIndex(games, data.idRoom);
  if (gameIndex === -1) { return emitError(socket, 'Sala não encontrada.'); }

  const game = games[gameIndex];
  if (game.getActualNumPlayers() === game.getNumPlayers()) { return emitError(socket, 'Sala cheia!'); }

  const player = new Player(socket.id, data.playerName, data.idRoom, data.avatar);
  game.addNewPlayer(player);

  games[gameIndex] = game;

  socket.join(game.getId());
  socket.emit('loadRoom', game.getPublicData(socket.id));
  
  game.getPlayers().forEach(p => {
    socket.to(p.getId()).emit('gameData', game.getPublicData(p.getId()));
  });
}

export default enterRoom;