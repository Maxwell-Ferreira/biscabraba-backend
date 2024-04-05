import Game from "../Models/Game";
import PlayCardRules from "../Rules/PlayCardRules";
import Validator from "../Validator";
import { ListenerProps } from "../Types/ListenerProps";

const playCard = async ({ io, socket, games, data }: ListenerProps) => {
  const payload = await Validator.validate(data, PlayCardRules);

  const game = Game.findByPlayerId(games, socket.id);
  if (!game) throw new Error("Socket não conectado à nenhuma sala.");

  game.playCard(payload.card_id, socket.id);

  const players = game.players;

  for (const p of players) {
    const publicData = game.getPublicData(p.id);
    io.to(p.id).emit("card-played", publicData);
  }

  if (game.verifyRoundCompleted()) {
    for (const p of players) {
      const publicData = game.getPublicData(p.id);
      io.to(p.id).emit("buy-card", publicData);
    }
  }

  if (game.end()) {
    io.to(game.id).emit(
      "winnerTeam",
      game.getWinner().map((p) => p.getPublicData())
    );
  }
};

export default playCard;
