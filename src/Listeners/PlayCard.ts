import Game from "../Models/Game";
import PlayCardRules from "../Rules/PlayCardRules";
import Validator from "../Validator";
import { ListenerProps } from "../Types/ListenerProps";

const playCard = async ({ io, socket, games, data }: ListenerProps) => {
  const payload = await Validator.validate(data, PlayCardRules);

  const game = Game.findByPlayerId(games, socket.id);
  if (!game) throw new Error("Socket não conectado à nenhuma sala.");

  game.playCard(payload.card_id, socket.id);

  const players = game.getPlayers();

  for (const player of players) {
    const publicData = game.getPublicData(player.getId());
    io.to(player.getId()).emit("card-played", publicData);
  }

  if (game.verifyRoundCompleted()) {
    for (const player of game.getPlayers()) {
      const publicData = game.getPublicData(player.getId());
      io.to(player.getId()).emit("buy-card", publicData);
    }
  }

  if (game.end())
    io.to(game.getId()).emit(
      "winnerTeam",
      game.getWinner().map((player) => player.getPublicData())
    );
};

export default playCard;
