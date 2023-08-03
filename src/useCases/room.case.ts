import CustomError from "../controllers/utils/CustomError";
import { Room } from "../types/Room";

const rooms: Room[] = [];

function pushRoom(room: Room) {
  if (roomExists(room.name)) {
    throw new CustomError(400, "A room with this name already exists");
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

function getAllRooms() {
  return rooms;
}

export { pushRoom, findRoomByName, getAllRooms };
