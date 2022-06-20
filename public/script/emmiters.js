window.onload = function () {

  $("#button_create").click(e => {
    e.preventDefault();
    const idRoom = $("#id_room_create").val();
    const playerName = $("#player_name_create").val();
    const numPlayers = $('input[name=num_players]:checked', '#form_create').val();

    const validate = createRoomValidator({ idRoom, playerName, numPlayers });
    if (validate) {
      socket.emit('createRoom', { idRoom, playerName, numPlayers })
    }
  });

  $("#button_enter").click(e => {
    e.preventDefault();
    const idRoom = $("#id_room_enter").val();
    const playerName = $("#player_name_enter").val();

    const validate = enterRoomValidator({ idRoom, playerName });
    if (validate) {
      socket.emit('enterRoom', { idRoom, playerName })
    }
  });
}