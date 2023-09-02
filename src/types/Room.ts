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
  currentRound?: number;
  chat: string[];
  players: Player[];
  canvas: DrawOptions;
}

export interface Guess {
  roomName: string;
  playerNickname: string;
  guess: string;
}
