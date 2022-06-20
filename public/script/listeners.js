socket.on('connect', () => player_id = socket.id);

const msg = (text) => {
  const messageDiv = $("<div class='message'>");
  messageDiv.html(text);
  $("#messages").append(messageDiv);

  setTimeout(() => messageDiv.css({ opacity: '1' }), 10);
  
  setTimeout(() => {
    messageDiv.css('opacity', '0');
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
};

socket.on('msg', data => { msg(data.text); });

/* --------------------------------------------------------------- */
const createRoom = data => {
  const loader = $("#loader");
  loader.css({ transform: 'translateX(0)', transition: '.5s'});
  sound('grand-entrance.m4a');
  setTimeout(() => {
    loadView('room', () => {
      $("#game-info > #player-name").html(`<strong>Nome:</strong> ${data.currentPlayer.name}`);
      $("#game-info > #id-room").html('<strong>ID da sala:</strong> ' + data.currentPlayer.room);
      $("#game-info > #num-players").html('<strong>Nº de Jogadores:</strong> ' + data.numPlayers);
    });
  }, 500);
  setTimeout(() => loader.css({ transform: 'translateX(100%)' }), 2600);
};

socket.on('createRoom', data => createRoom(data));
/* ------------------------------------------------------------ */

/* ------------------------------------------------------------ */
newPlayer = data => {
  /* msg(`${data.}`); */
  console.log(data);
}
socket.on('newPlayer', data => msg(`${data.name} se conectou à sala!`));
/* ------------------------------------------------------------ */