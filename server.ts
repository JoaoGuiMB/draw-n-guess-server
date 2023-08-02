import * as dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { createRoom } from "./src/controllers/room.controller";
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
  console.log("a user connected");

  socket.on("create-room", (data) => createRoom(socket, data));

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.disconnect();
  });
});
