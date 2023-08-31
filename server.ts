import * as dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import {
  createRoom,
  getRooms,
  joinRoom,
  playerLeaveRoom,
  playerGuess,
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

  socket.on("player-guess", (data) => playerGuess(socket, data, io));

  socket.on("disconnect", (data) => {
    console.log("user disconnected");
    playerLeaveRoom(socket);
    socket.disconnect();
  });
});
