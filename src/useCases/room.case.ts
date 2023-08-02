import { Room } from "../types/Room";

const rooms: Room[] = [];

function pushRoom(room: Room) {
  if (roomExists(room.name)) {
    throw new Error("Room already exists");
  }
  rooms.push(room);
  console.log(rooms);
}

function roomExists(name: string) {
  return findRoomByName(name) !== undefined;
}

function findRoomByName(id: string) {
  return rooms.find((room) => room.name === id);
}

export { pushRoom, findRoomByName };
