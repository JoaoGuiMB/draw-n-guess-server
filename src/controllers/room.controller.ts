import { Socket } from "socket.io";
import { Room } from "../types/Room";
import { pushRoom } from "../useCases/room.case";
import { createRoomSchema } from "../validations/room/createRoom";
import { z } from "zod";

export function createRoom(socket: Socket, room: Room) {
  try {
    pushRoom(room);
    createRoomSchema.parse(room);
    socket.join(room.name);
  } catch (e) {
    if (e instanceof z.ZodError) {
      socket.emit("invalid-data", {
        message: e.message,
      });
    }
  }
}
