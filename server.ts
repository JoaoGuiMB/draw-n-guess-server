import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import app from "./src/app";

const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.disconnect();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
