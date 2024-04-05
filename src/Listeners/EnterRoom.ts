import Validator from "../Validator";
import Game from "../Models/Game";
import Player from "../Models/Player";
import { enterProps } from "../Models/Interfaces";
import EnterRoomRules from "../Rules/EnterRoomRules";
import { ListenerProps } from "../Types/ListenerProps";

const enterRoom = async ({ socket, games, data }: ListenerProps) => {
  const payload = await Validator.validate<enterProps>(data, EnterRoomRules);

  const game = Game.findOrFail(games, payload.idRoom);
  if (game.actualNumPlayers === game.numPlayers) {
    throw new Error("Sala cheia!");
  }

  const player = new Player(
    socket.id,
    payload.playerName,
    payload.idRoom,
    payload.avatar
  );
  game.addNewPlayer(player);

  socket.join(game.id);
  socket.emit("loadRoom", game.getPublicData(socket.id));

  const otherPlayers = game.players.filter((p) => p.id !== player.id);

  for (const p of otherPlayers) {
    socket.to(p.id).emit("newPlayer", game.getPublicData(p.id));
  }
};

export default enterRoom;
