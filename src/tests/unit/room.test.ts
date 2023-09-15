import { describe, it, expect, afterAll } from "vitest";
import {
  getAllRooms,
  pushRoom,
  resetRooms,
  addPlayerToRoom,
  removeFromRoom,
} from "../../useCases/room.case";
import { mockRoom } from "../mocks/room";
import { mockPlayer } from "../mocks/player";

const ROOM_NOT_FOUND_NAME = "notFoundRoom";

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
    expect(() => addPlayerToRoom(ROOM_NOT_FOUND_NAME, mockPlayer)).toThrow(
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

describe("remove player from room", () => {
  afterAll(() => {
    resetRooms();
  });

  it("should not find room", () => {
    expect(() => removeFromRoom(ROOM_NOT_FOUND_NAME, mockPlayer.id)).toThrow(
      "Room not found"
    );
  });

  it("should throw player not found", () => {
    pushRoom(mockRoom);
    expect(() => removeFromRoom(mockRoom.name, "invalid player id")).toThrow(
      "Player not found"
    );
  });

  it("should remove player from room", () => {
    addPlayerToRoom(mockRoom.name, mockPlayer);
    expect(() => removeFromRoom(mockRoom.name, mockPlayer.id)).not.toThrow();
    expect(getAllRooms()[0].players.length).toBe(0);
  });
});
