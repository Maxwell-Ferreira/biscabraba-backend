import { Socket } from "socket.io";
import Game from "../Models/Game";
import MessageRules from "../Rules/MessageRules";
import { findGameIndexByPlayerId } from "../Utils";
import Validator from "../Validator";

const message = async (io: any, socket: Socket, games: Array<Game>, props: any) => {
  const data = await Validator.validate(props, MessageRules);
  if (data.errors) { return false; }

  const text = data.text;

  const gameIndex = findGameIndexByPlayerId(games, socket.id);
  if (gameIndex !== -1) {
    const player = games[gameIndex].getPlayerById(socket.id);
    const playerName = player?.getName() || '';

    const messageId = games[gameIndex].addMessage(text, playerName); 
    const message = { playerName, text, id: messageId };

    io.to(player?.getRoom()).emit('chat-message', message);
  }
}

export default message;