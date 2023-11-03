import { isArray } from "lodash";
import { Socket } from "socket.io";

export function emitError(socket: Socket, errors: Array<any>|string) {
  if(isArray(errors)) {
    socket.emit('error', errors);
  } else {
    socket.emit('error', [{ message: errors }]);
  }
}

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
