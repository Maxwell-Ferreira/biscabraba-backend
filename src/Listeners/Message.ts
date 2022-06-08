import { Socket } from "socket.io";
import Game from "../Models/Game";
import messageRules from "../Rules/MessageRules";
import { findGameIndexByPlayerId } from "../Utils";
import Validator from "../Validator";

const message = async (io: any, socket: Socket, games: Array<Game>, props: any) => {
  const data = await Validator.validate(props, messageRules());
  if (!data) { return false; }

  const text = data.text;

  const gameIndex = findGameIndexByPlayerId(games, socket.id);
  if (gameIndex !== -1) {
    const player = games[gameIndex].getPlayerById(socket.id);
    const message = { playerName: player?.getName(), text }

    io.to(player?.getRoom()).emit('message', message);
  }
}

export default message;