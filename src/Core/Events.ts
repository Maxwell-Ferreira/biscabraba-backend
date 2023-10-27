import { Socket } from "socket.io";
import Game from "../Models/Game";
import { emitError } from "../Utils";

interface Event {
  event: string;
  listener: string;
}

export default class Events {
  private events: Event[] = [
    { event: "createRoom", listener: "CreateRoom" },
    { event: "enterRoom", listener: "EnterRoom" },
    { event: "startGame", listener: "StartGame" },
    { event: "playCard", listener: "PlayCard" },
    { event: "message", listener: "Message" },
    { event: "disconnect", listener: "Disconnect" },
  ];

  public register(io: any, socket: Socket, games: Array<Game>) {
    for (const event of this.events) {
      socket.on(event.event, async (data) => {
        const { default: listener } = await import(
          `../Listeners/${event.listener}`
        ).catch(() => null);

        if (!listener) {
          return emitError(socket, "Listener não existe.");
        }

        try {
          await listener({ data, io, socket, games });
        } catch (e: any) {
          emitError(socket, e.message || e);
        }
      });
    }
  }
}
