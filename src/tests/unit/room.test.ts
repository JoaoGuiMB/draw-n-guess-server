import { describe, it, expect, afterAll } from "vitest";
import {
  getAllRooms,
  pushRoom,
  resetRooms,
  addPlayerToRoom,
} from "../../useCases/room.case";
import { mockRoom } from "../mocks/room";
import { mockPlayer } from "../mocks/player";

describe("Push room", () => {
  afterAll(() => {
    resetRooms();
  });

  it("should push room", () => {
    pushRoom(mockRoom);
    const rooms = getAllRooms();
    expect(rooms.length).toBe(1);
  });

  it("should not push room with same name", () => {
    expect(() => pushRoom(mockRoom)).toThrow(
      "A room with this name already exists"
    );
  });
});

describe("add player to room", () => {
  afterAll(() => {
    resetRooms();
  });

  it("should not find room", () => {
    expect(() => addPlayerToRoom("notFoundRoom", mockPlayer)).toThrow(
      "Room not found"
    );
  });

  it("should add player to room", () => {
    pushRoom(mockRoom);
    const room = addPlayerToRoom(mockRoom.name, mockPlayer);
    expect(room.players.length).toBe(1);
  });

  it("should throw nickname already in use", () => {
    expect(() => addPlayerToRoom(mockRoom.name, mockPlayer)).toThrow(
      "This nickname is already in use"
    );
  });

  it("should throw room is full", () => {
    const player2 = { ...mockPlayer, nickName: "player2" };
    const player3 = { ...mockPlayer, nickName: "player3" };
    addPlayerToRoom(mockRoom.name, player2);
    expect(() => addPlayerToRoom(mockRoom.name, player3)).toThrow(
      "Room is full"
    );
  });
});
