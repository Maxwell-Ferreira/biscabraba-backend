import { validations } from "indicative/validator";
import EnterRoomRules from "./EnterRoomRules";

const rules = () => {
  return {
    idRoom: 'required|string|max:12|min:4',
    playerName: 'required|string|max:20|min:4',
    numPlayers: [
      validations.required(),
      validations.integer(),
      validations.in([2, 4]),
    ],
    avatar: 'required|in:1,2,3,4'
  }
}

const messages = () => {
  return {
    ...EnterRoomRules.messages(),
    'numPlayers.required': 'Favor, selecione o número de Jogadores',
    'numPlayers.integer': 'Numero de jogadores deve ser um numero',
    'numPlayers.in': 'Numero de jogadores deve ser 2 ou 4'
  }
}

export default { rules, messages };
