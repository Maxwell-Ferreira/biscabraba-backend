import { Socket } from "socket.io";
import Game from "../Models/Game";

export interface ListenerProps {
  data: any,
  io: any,
  socket: Socket,
  games: Array<Game>
}