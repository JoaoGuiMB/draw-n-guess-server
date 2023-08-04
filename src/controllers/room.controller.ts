import { Socket, Server } from "socket.io";
import { Room } from "../types/Room";
import { pushRoom, getAllRooms } from "../useCases/room.case";
import { createRoomSchema } from "../validations/room/createRoom";

import { z } from "zod";
import CustomError from "../utils/CustomError";

export function createRoom(socket: Socket, room: Room, io: Server) {
  try {
    createRoomSchema.parse(room);
    pushRoom(room);
    socket.join(room.name);
    socket.emit("room-created", {
      message: "The room was created successfully",
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      socket.emit("invalid-data", {
        message: e.message,
      });
    } else if (e instanceof CustomError) {
      socket.emit("create-room-error", {
        message: e.message,
      });
    }
  }
}

export function getRooms(socket: Socket) {
  const rooms = getAllRooms();
  socket.emit("rooms", rooms);
}
