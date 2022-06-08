const enterRoomRules = () => {
  return {
    idRoom: 'required|string|max:12|min:4',
    playerName: 'required|string|max:12|min:4'
  }
}

export default enterRoomRules;
