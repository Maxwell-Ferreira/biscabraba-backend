const createRoomValidator = data => {
  const errors = [];
  
  if(data.idRoom.length <= 3) { errors.push("Insira um id com mais de 3 caracteres!"); }
  if(data.playerName.length <= 3) { errors.push("Insira um nome com mais de 3 caracteres!"); }
  if(!["2", "4"].includes(data.numPlayers)) { errors.push("A partida deve ter 2 ou 4 jogadores!"); }

  if (errors.length) {
    errors.forEach(error => { msg(error) });
    sound('bruh.weba');
    return false;
  }

  return true;
};

const enterRoomValidator = data => {
  const errors = [];
  if(data.idRoom.length <= 3) { errors.push("Insira um id com mais de 3 caracteres!"); }
  if(data.playerName.length <= 3) { errors.push("Insira um nome com mais de 3 caracteres!"); }

  if (errors.length) {
    errors.forEach(error => { msg(error) });
    sound('bruh.weba');
    return false;
  }

  return true;
};