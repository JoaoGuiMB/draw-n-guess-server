import CustomError from "../utils/CustomError";
import { Room } from "../types/Room";
import { Player } from "../types/Player";

const rooms: Room[] = [];

function pushRoom(room: Room) {
  if (roomExists(room.name)) {
    throw new CustomError(400, "A room with this name already exists");
  }
  room.players = [];
  rooms.push(room);
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

function addToRoom(roomName: string, player: Player) {
  const room = findRoomByName(roomName);
  if (!room) throw new CustomError(404, "Room not found");
  if (room.players.length >= room.maximumNumberOfPlayers)
    throw new CustomError(400, "Room is full");
  room.players.push(player);
  console.log(rooms);
  return room;
}

function removeFromRoom(roomName: string, playerId: string) {
  const room = findRoomByName(roomName);
  if (!room) throw new CustomError(404, "Room not found");
  const playerIndex = room.players.findIndex(
    (player) => player.id === playerId
  );
  if (playerIndex === -1) throw new CustomError(404, "Player not found");
  room.players.splice(playerIndex, 1);
  console.log(rooms);
}

function findRoomByPlayerId(playerId: string) {
  return rooms.find((room) => {
    return room.players.find((player) => player.id === playerId);
  });
}

function removePlayer(playerId: string) {
  const room = findRoomByPlayerId(playerId);
  if (!room) throw new CustomError(404, "Room not found");
  removeFromRoom(room.name, playerId);
  return room;
}

export {
  pushRoom,
  findRoomByName,
  getAllRooms,
  addToRoom,
  removeFromRoom,
  removePlayer,
};
