import { Socket, Server } from "socket.io";
import { Room } from "../types/Room";
import {
  pushRoom,
  getAllRooms,
  addToRoom,
  removePlayer,
} from "../useCases/room.case";
import { createRoomSchema } from "../validations/room/createRoom";

import { z } from "zod";
import CustomError from "../utils/CustomError";
import { JoinRoom, LeaveRoom } from "../types/JoinRoom";

export function createRoom(socket: Socket, room: Room, io: Server) {
  try {
    createRoomSchema.parse(room);

    pushRoom(room);
    socket.join(room.name);
    io.to(socket.id).emit("room-created", {
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

export function joinRoom(socket: Socket, joinRoomData: JoinRoom) {
  try {
    const { roomName, player } = joinRoomData;
    player.id = socket.id;
    addToRoom(roomName, player);
    socket.join(roomName);

    socket.emit("player-joined-room", player.id);
  } catch (e) {
    if (e instanceof CustomError) {
      socket.emit("join-room-error", {
        message: e.message,
      });
    }
  }
}

export function playerLeaveRoom(socket: Socket) {
  try {
    const roomName = removePlayer(socket.id);
    socket.leave(roomName);
    socket.emit("player-left-room", {
      message: "You left the room successfully",
    });
    getAllRooms();
  } catch (e) {
    if (e instanceof CustomError) {
      socket.emit("player-leave-room-error", {
        message: e.message,
      });
    }
  }
}
