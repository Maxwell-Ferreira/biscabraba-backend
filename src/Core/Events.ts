import { Socket } from "socket.io";
import Game from '../Models/Game';

import createRoom from "../Listeners/CreateRoom";
import enterRoom from "../Listeners/EnterRoom";
import startGame from "../Listeners/StartGame";
import playCard from "../Listeners/PlayCard";
import message from "../Listeners/Message";
import disconnect from "../Listeners/Disconnect";

export default class Events {
  static register(io: any, socket: Socket, games: Array<Game>) {
    socket.on('createRoom', props => { createRoom(socket, games, props);    });
    socket.on('enterRoom',  props => { enterRoom(io, socket, games, props); });
    socket.on('startGame',  ()    => { startGame(io, socket, games);        });
    socket.on('playCard',   props => { playCard(io, socket, games, props)   });
    socket.on('message',    props => { message(io, socket, games, props)    });
    socket.on('disconnect', ()    => { disconnect(io, socket, games)        });
  }
}