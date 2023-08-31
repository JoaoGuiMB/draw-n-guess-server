import { Socket, Server } from "socket.io";
import { Guess, Room } from "../types/Room";
import {
  pushRoom,
  getAllRooms,
  addToRoom,
  removePlayer,
  findRoomByName,
} from "../useCases/room.case";
import { createRoomSchema } from "../validations/room/createRoom";

import { z } from "zod";
import CustomError from "../utils/CustomError";
import { JoinRoom } from "../types/JoinRoom";

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
    const joinedRoom = addToRoom(roomName, player);
    socket.join(roomName);

    socket.emit("player-joined-room", {
      playerId: socket.id,
      room: joinedRoom,
    });
    socket.to(roomName).emit("update-players", joinedRoom.players);
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
    const room = removePlayer(socket.id);
    socket.leave(room.name);
    socket.emit("player-left-room", {
      message: "You left the room successfully",
    });
    socket.to(room.name).emit("update-players", room.players);
    getAllRooms();
    socket.leave(room.name);
  } catch (e) {
    if (e instanceof CustomError) {
      socket.emit("player-leave-room-error", {
        message: e.message,
      });
    }
  }
}

export function playerGuess(socket: Socket, data: Guess, io: Server) {
  const currentRoom = findRoomByName(data.roomName);
  if (!currentRoom) throw new CustomError(404, "Room not found");
  console.log("Player guess", data);

  currentRoom.chat.push(`${data.playerNickname}: ${data.guess}`);
  io.to(currentRoom.name).emit("update-room", currentRoom);
}
