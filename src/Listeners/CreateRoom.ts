import Game from "../Models/Game";
import { createProps } from "../Models/Interfaces";
import Player from "../Models/Player";
import CreateRoomRules from "../Rules/CreateRoomRules";
import Validator from "../Validator";
import { ListenerProps } from "../Types/ListenerProps";

const createRoom = async ({ socket, games, data }: ListenerProps) => {
  const payload = await Validator.validate<createProps>(data, CreateRoomRules);

  const alreadyExistsRoom = !!Game.find(games, payload.idRoom);
  if (alreadyExistsRoom) throw new Error("Já existe uma sala com este ID.");

  socket.join(payload.idRoom);
  const player = new Player(
    socket.id,
    payload.playerName,
    payload.idRoom,
    payload.avatar
  );

  const newGame: Game = new Game(payload.idRoom, payload.numPlayers);
  newGame.addNewPlayer(player);

  games.push(newGame);
  socket.emit("loadRoom", newGame.getPublicData(socket.id));
};

export default createRoom;
