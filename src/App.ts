import { Socket } from 'socket.io';
import Events from './Core/Events';
import Game from './Models/Game';

function App(io: any) {
  const games: Array<Game> = [];

  io.on('connection', function (socket: Socket) {
    console.log(`Socket connected -> id:${socket.id}`);

    Events.register(io, socket, games);
  });
}

export default App;