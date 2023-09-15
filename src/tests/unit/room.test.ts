import { describe, it, expect, afterAll } from "vitest";
import { getAllRooms, pushRoom, resetRooms } from "../../useCases/room.case";
import { mockRoom } from "../mocks/room";

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
