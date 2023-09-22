import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../../app";

import { mockRoom } from "../mocks/room";
import { Server, Socket } from "socket.io";
import { Socket as ClientSocket, io as ioc } from "socket.io-client";

import { handleSocketEvents } from "../../utils/handleSocketEvents";

import { createServer } from "http";

interface Response {
  message: string;
}

function waitFor(emitter: ClientSocket, event: string) {
  return new Promise<Response>((resolve) => {
    emitter.once(event, resolve);
  });
}

async function setupServer() {
  const httpServer = createServer(app);

  const io = new Server(httpServer);
  httpServer.listen(PORT);

  const clientSocket = ioc(`ws://localhost:${PORT}`, {
    transports: ["websocket"],
  });

  let serverSocket: Socket | undefined = undefined;
  io.on("connection", (connectedSocket) => {
    serverSocket = connectedSocket;
    handleSocketEvents(io, serverSocket);
  });

  await waitFor(clientSocket, "connect");

  return { io, clientSocket, serverSocket };
}

const PORT = 1337;

describe("create room", () => {
  let io: Server;

  let serverSocket: Socket | undefined;
  let clientSocket: ClientSocket;

  beforeAll(async () => {
    const response = await setupServer();
    io = response.io;
    clientSocket = response.clientSocket;
    serverSocket = response.serverSocket;
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it("should create a room", async () => {
    clientSocket.emit("create-room", mockRoom);
    const expectedMessage = "The room was created successfully";
    const { message } = await waitFor(clientSocket, "room-created");

    expect(message).toBe(expectedMessage);
  });

  it("should throw invalid  room data", async () => {
    clientSocket.emit("create-room", { ...mockRoom, name: "" });
    const expectedMessage = "Room name must contain at least 2 characters";
    const { message } = await waitFor(clientSocket, "invalid-data");

    expect(message).toBe(expectedMessage);
  });

  it("should throw room already exist", async () => {
    clientSocket.emit("create-room", mockRoom);
    const expectedMessage = "A room with this name already exists";
    const { message } = await waitFor(clientSocket, "create-room-error");

    expect(message).toBe(expectedMessage);
  });
});
