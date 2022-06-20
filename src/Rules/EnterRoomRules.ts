const rules = () => {
  return {
    idRoom: 'required|string|max:12|min:4',
    playerName: 'required|string|max:20|min:4',
    avatar: 'required|in:1,2,3,4'
  }
}

const messages = () => {
  return {
    'idRoom.required': 'Favor, insira o ID da Sala',
    'idRoom.max': 'O ID da sala deve conter no máximo 12 caracteres',
    'idRoom.min': 'O ID da sala deve conter no mínimo 4 caracteres',

    'playerName.required': 'Favor, insira o apelido',
    'playerName.max': 'O apelido deve conter no máximo 20 caracteres',
    'playerName.min': 'O apelido deve conter no mínimo 4 caracteres',

    'avatar.required': 'Favor, selecione o seu avatar',
    'avatar.in': 'O avatar deve ser 1, 2, 3 ou 4',
  }
}

export default { rules, messages };
