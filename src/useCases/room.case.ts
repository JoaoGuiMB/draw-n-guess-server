import CustomError from "../utils/CustomError";
import { Guess, Room } from "../types/Room";
import { Player } from "../types/Player";
import { PlayerDraw } from "../types/Draw";
import { roomConfig } from "../utils/roomConfig";
import { categories } from "../data";
import { Category } from "../types/Category";

const rooms: Room[] = [];

export function pushRoom(room: Room) {
  if (roomExists(room.name)) {
    throw new CustomError(400, "A room with this name already exists");
  }
  room.timer = roomConfig.timer;
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
  if (checkIfPlayerIsAlreadyInRoom(room, player.nickName))
    throw new CustomError(400, "This nickname is already in use");
  player.isPlayerTurn = false;
  room.players.push(player);

  return room;
}

export function checkIfPlayerIsAlreadyInRoom(
  room: Room,
  playerNickname: string
) {
  return room.players.find((player) => player.nickName === playerNickname);
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

export function startNewTurn(roomName: string) {
  const room = validateRoomNotFoundByName(roomName);
  room.currentWord = getWordFromRoomCategory(room.category);
  room.currentPlayer = getRandomPlayerFromRoom(room).nickName;
  setAllPlayersTurnToFalse(room.currentPlayer, room);
  return room;
}

export function getWordFromRoomCategory(category: Category) {
  const categoryWords = categories[category];
  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  return categoryWords[randomIndex];
}

export function getRandomPlayerFromRoom(room: Room) {
  const randomIndex = Math.floor(Math.random() * room.players.length);
  const player = room.players[randomIndex];
  player.isPlayerTurn = true;
  return player;
}

export function setAllPlayersTurnToFalse(playerName: string, room: Room) {
  room.players.map((player) => {
    if (player.nickName !== playerName) {
      player.isPlayerTurn = false;
    }
  });
}

export function turnHasStoped(roomName: string) {
  const room = validateRoomNotFoundByName(roomName);
  room.currentPlayer = undefined;
  room.currentWord = undefined;
  room.players.map((player) => (player.isPlayerTurn = false));
  return room;
}

export function drecreaseTimer(room: Room) {
  room.timer--;
}
