import { validations } from "indicative/validator";

const createRoomRules = () => {
  return {
    idRoom: 'required|string|max:12|min:4',
    playerName: 'required|string|max:12|min:4',
    numPlayers: [
      validations.required(),
      validations.integer(),
      validations.in([2, 4]),
    ]
  }
}

export default createRoomRules;
