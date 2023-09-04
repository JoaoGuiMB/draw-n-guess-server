import { Socket, Server } from "socket.io";
import { Guess, Room } from "../types/Room";
import {
  pushRoom,
  getAllRooms,
  addToRoom,
  removePlayer,
  playerMakeGuess,
  playerMakeDraw,
  startNewTurn,
  drecreaseTimer,
  turnHasStoped,
} from "../useCases/room.case";
import { createRoomSchema } from "../validations/room/createRoom";

import { z } from "zod";
import CustomError from "../utils/CustomError";
import { JoinRoom } from "../types/JoinRoom";
import { PlayerDraw } from "../types/Draw";
import { roomConfig } from "../utils/roomConfig";

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

export function playerGuess(data: Guess, io: Server) {
  const chat = playerMakeGuess(data);
  io.to(data.roomName).emit("update-chat", chat);
}

export function playerDraw(data: PlayerDraw, io: Server) {
  const canvas = playerMakeDraw(data);
  io.to(data.roomName).emit("update-canvas-state", canvas);
}

export function startTurn(roomName: string, io: Server) {
  const room = startNewTurn(roomName);
  // let intervalId;
  // if (room.timer > 0) {
  //   intervalId = setInterval(() => {
  //     drecreaseTimer(room);
  //     io.to(roomName).emit("update-timer", room.timer);
  //   }, 1000);
  // } else {
  //   clearInterval(intervalId);
  //   room.timer = roomConfig.timer;
  // }
  io.to(roomName).emit("turn-started", room);
}

export function stopTurn(roomName: string, io: Server) {
  const room = turnHasStoped(roomName);
  // let intervalId;
  // if (room.timer > 0) {
  //   intervalId = setInterval(() => {
  //     drecreaseTimer(room);
  //     io.to(roomName).emit("update-timer", room.timer);
  //   }, 1000);
  // } else {
  //   clearInterval(intervalId);
  //   room.timer = roomConfig.timer;
  // }
  io.to(roomName).emit("turn-stopped", room);
}
