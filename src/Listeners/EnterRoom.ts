import { Socket } from "socket.io";
import Game from "../Models/Game";
import { enterProps } from "../Models/Interfaces";
import Player from "../Models/Player";
import enterRoomRules from "../Rules/EnterRoomRules";
import { emitError, findGameIndex } from "../Utils";
import Validator from "../Validator";

const enterRoom = async (io:any, socket:Socket, games:Array<Game>, props:any) => {
  const data = await Validator.validate(props, enterRoomRules()) as enterProps;
  if (!data) { return emitError(socket, 'Dados inválidos.'); }

  const gameIndex = findGameIndex(games, data.idRoom);
  if (gameIndex === -1) { return emitError(socket, 'Socket não conectado à nenhuma sala.'); }

  const game = games[gameIndex];
  if (game.getActualNumPlayers() === game.getNumPlayers()) { return emitError(socket, 'Sala cheia!'); }

  const player = new Player(socket.id, data.playerName, data.idRoom);
  game.addNewPlayer(player);

  games[gameIndex] = game;

  socket.join(game.getId());
  socket.emit('enterRoom', game.getPublicData(socket.id));

  game.getPlayers().forEach(player => {
    io.sockets[player.getId()].emit('newPlayer', game.getPublicData(player.getId()))
  });
}

export default enterRoom;