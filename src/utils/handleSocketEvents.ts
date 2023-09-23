import { Server, Socket } from "socket.io";
import {
  createRoom,
  getRooms,
  joinRoom,
  playerLeaveRoom,
  playerGuess,
  playerDraw,
  startTurn,
} from "../controllers/room.controller";

type Controller = (io: Server, socket: Socket, data: any) => void;

export function handleSocketEvents(io: Server, socket: Socket) {
  const socketsEvents = {
    "create-room": (data: any) => createRoom(socket, data),
    "get-rooms": () => getRooms(socket),
    "join-room": (data: any) => joinRoom(io, socket, data),
    "player-leave-room": () => playerLeaveRoom(socket),
    "player-guess": (data: any) => playerGuess(data, socket, io),
    "player-draw": (data: any) => playerDraw(data, io),
    "start-turn": (data: any) => startTurn(data, io),
    disconnect: () => {
      console.log("user disconnected"),
        playerLeaveRoom(socket),
        socket.disconnect();
    },
  };

  const socketMap: Map<string, Controller> = new Map(
    Object.entries(socketsEvents)
  );

  for (const [event, controller] of socketMap.entries()) {
    socket.on(event, controller);
  }
}
