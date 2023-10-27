import Validator from "../Validator";
import Game from "../Models/Game";
import Player from "../Models/Player";
import { enterProps } from "../Models/Interfaces";
import EnterRoomRules from "../Rules/EnterRoomRules";
import { ListenerProps } from "../Types/ListenerProps";

const enterRoom = async ({ socket, games, data }: ListenerProps) => {
  const payload = await Validator.validate<enterProps>(data, EnterRoomRules);

  const game = Game.findOrFail(games, payload.idRoom);
  if (game.getActualNumPlayers() === game.getNumPlayers()) {
    throw new Error("Sala cheia!");
  }

  const player = new Player(
    socket.id,
    payload.playerName,
    payload.idRoom,
    payload.avatar
  );
  game.addNewPlayer(player);

  socket.join(game.getId());
  socket.emit("loadRoom", game.getPublicData(socket.id));

  const otherPlayers = game
    .getPlayers()
    .filter((gamePlayer) => gamePlayer.getId() !== player.getId());

  for (const player of otherPlayers) {
    socket
      .to(player.getId())
      .emit("newPlayer", game.getPublicData(player.getId()));
  }
};

export default enterRoom;
