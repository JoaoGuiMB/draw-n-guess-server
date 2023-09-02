import CustomError from "../utils/CustomError";
import { Guess, Room } from "../types/Room";
import { Player } from "../types/Player";
import { PlayerDraw } from "../types/Draw";

const rooms: Room[] = [];

export function pushRoom(room: Room) {
  if (roomExists(room.name)) {
    throw new CustomError(400, "A room with this name already exists");
  }
  room.chat = [];
  room.players = [];
  rooms.push(room);
}

export function roomExists(name: string) {
  return findRoomByName(name) !== undefined;
}

export function findRoomByName(id: string) {
  return rooms.find((room) => room.name === id);
}

export function getAllRooms() {
  return rooms;
}

export function validateRoomNotFoundByName(roomName: string) {
  const room = findRoomByName(roomName);
  if (!room) throw new CustomError(404, "Room not found");
  return room;
}

export function addToRoom(roomName: string, player: Player) {
  const room = validateRoomNotFoundByName(roomName);
  if (room.players.length >= room.maximumNumberOfPlayers)
    throw new CustomError(400, "Room is full");
  room.players.push(player);
  console.log(rooms);
  return room;
}

export function removeFromRoom(roomName: string, playerId: string) {
  const room = validateRoomNotFoundByName(roomName);
  const playerIndex = room.players.findIndex(
    (player) => player.id === playerId
  );
  if (playerIndex === -1) throw new CustomError(404, "Player not found");
  room.players.splice(playerIndex, 1);
  console.log(rooms);
}

export function findRoomByPlayerId(playerId: string) {
  return rooms.find((room) => {
    return room.players.find((player) => player.id === playerId);
  });
}

export function removePlayer(playerId: string) {
  const room = findRoomByPlayerId(playerId);
  if (!room) throw new CustomError(404, "Room not found");
  removeFromRoom(room.name, playerId);
  return room;
}

export function playerMakeGuess(playerGuess: Guess) {
  const { guess, playerNickname, roomName } = playerGuess;
  const room = validateRoomNotFoundByName(roomName);

  room.chat.push(`${playerNickname}: ${guess}`);
  return room.chat;
}

export function playerMakeDraw(playerDraw: PlayerDraw) {
  const { drawOptions, roomName } = playerDraw;
  const room = validateRoomNotFoundByName(roomName);
  room.canvas = drawOptions;
  return room.canvas;
}
