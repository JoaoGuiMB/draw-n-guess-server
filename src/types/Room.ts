import { Category } from "./Category";
import { Player } from "./Player";

export type MaximumPoints = 80 | 100 | 120 | 200;

export interface CreateRoom {
  name: string;
  category: Category;
  maxNumberOfPlayers: number;
  maximumPoints: MaximumPoints;
  currentWord?: string;
  currentRound?: number;
  players: Player[];
}
