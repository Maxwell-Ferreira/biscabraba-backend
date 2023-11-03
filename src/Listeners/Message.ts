import Game from "../Models/Game";
import MessageRules from "../Rules/MessageRules";
import Validator from "../Validator";
import { ListenerProps } from "../Types/ListenerProps";

const message = async ({ io, socket, games, data }: ListenerProps) => {
  const payload = await Validator.validate(data, MessageRules).catch(
    () => null
  );
  if (!payload) return;

  const text = data.text;

  const game = Game.findByPlayerId(games, socket.id);
  if (!game) return;

  const player = game.getPlayerById(socket.id)!;
  const playerName = player.getName() || "";

  const messageId = game.addMessage(text, playerName);
  const message = { playerName, text, id: messageId, createdAt: new Date() };

  io.to(player.getRoom()).emit("chat-message", message);
};

export default message;
