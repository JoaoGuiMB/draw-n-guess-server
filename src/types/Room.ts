import { Category } from "./Category";
import { DrawOptions } from "./Draw";
import { Player } from "./Player";

export type MaximumPoints = "80" | "100" | "120" | "200";

export interface Room {
  name: string;
  category: Category;
  maximumNumberOfPlayers: number;
  maximumPoints: MaximumPoints;
  currentWord?: string;
  currentPlayer?: string;
  chat: string[];
  players: Player[];
  canvas: DrawOptions;
  timer: number;
}

export interface Guess {
  roomName: string;
  playerNickname: string;
  guess: string;
}
