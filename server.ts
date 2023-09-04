import * as dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import {
  createRoom,
  getRooms,
  joinRoom,
  playerLeaveRoom,
  playerGuess,
  playerDraw,
  startTurn,
  stopTurn,
} from "./src/controllers/room.controller";
import app from "./src/app";

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("create-room", (data) => createRoom(socket, data, io));

  socket.on("get-rooms", () => getRooms(socket));

  socket.on("join-room", (data) => joinRoom(socket, data));

  socket.on("player-leave-room", () => playerLeaveRoom(socket));

  socket.on("player-guess", (data) => playerGuess(data, io));

  socket.on("player-draw", (data) => playerDraw(data, io));

  socket.on("start-turn", (data) => startTurn(data, io));

  socket.on("stop-turn", (data) => stopTurn(data, io));

  socket.on("disconnect", (data) => {
    console.log("user disconnected");
    playerLeaveRoom(socket);
    socket.disconnect();
  });
});
