import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Socket as ClientSocket } from "socket.io-client";

import { mockRoom } from "../mocks/room";
import { Server, Socket } from "socket.io";
import setupTestServer from "../../utils/tests/setupTestServer";
import waitFor from "../../utils/tests/waitForSocketEvent";
import { Room } from "../../types/Room";

interface Message {
  message: Message;
}

describe("create room", () => {
  let io: Server;

  let serverSocket: Socket | undefined;
  let clientSocket: ClientSocket;

  beforeAll(async () => {
    const response = await setupTestServer();
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
    const { message }: Message = await waitFor(clientSocket, "room-created");

    expect(message).toBe(expectedMessage);
  });

  it("should throw invalid  room data", async () => {
    clientSocket.emit("create-room", { ...mockRoom, name: "" });
    const expectedMessage = "Room name must contain at least 2 characters";
    const { message }: Message = await waitFor(clientSocket, "invalid-data");

    expect(message).toBe(expectedMessage);
  });

  it("should throw room already exist", async () => {
    clientSocket.emit("create-room", mockRoom);
    const expectedMessage = "A room with this name already exists";
    const { message }: Message = await waitFor(
      clientSocket,
      "create-room-error"
    );

    expect(message).toBe(expectedMessage);
  });
});

describe("get rooms", () => {
  let io: Server;

  let serverSocket: Socket | undefined;
  let clientSocket: ClientSocket;

  beforeAll(async () => {
    const response = await setupTestServer();
    io = response.io;
    clientSocket = response.clientSocket;
    serverSocket = response.serverSocket;
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it("should get rooms", async () => {
    clientSocket.emit("get-rooms");
    clientSocket.emit("create-room", mockRoom);
    const rooms: Room[] = await waitFor(clientSocket, "rooms");

    expect(rooms[0].name).toBe(mockRoom.name);
  });
});
