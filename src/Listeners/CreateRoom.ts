import { Socket } from "socket.io";
import Game from "../Models/Game";
import { createProps } from "../Models/Interfaces";
import Player from "../Models/Player";
import CreateRoomRules from "../Rules/CreateRoomRules";
import { emitError, findGame } from "../Utils";
import Validator from "../Validator";

const createRoom = async (socket:Socket, games:Array<Game>, props:any) => {
  const data = await Validator.validate(props, CreateRoomRules) as createProps;
  if (data?.errors) { return emitError(socket, data?.errors); }

  if (findGame(games, data.idRoom)) { return emitError(socket, 'Já existe uma sala com este ID.'); }

  socket.join(data.idRoom);
  const player = new Player(socket.id, data.playerName, data.idRoom, data.avatar);

  const newGame: Game = new Game(data.idRoom, data.numPlayers);
  newGame.addNewPlayer(player);

  games.push(newGame);
  socket.emit('loadRoom', newGame.getPublicData(socket.id));
}

export default createRoom;