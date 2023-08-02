import * as z from "zod";

const CategoryEnum = z.enum(["ANIME", "ANIMALS", "MOVIES", "SPORTS"]);

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(2, "Room name must contain at least 2 characters")
    .max(20, "Username must not contain more than 20 characters"),
  roomId: z
    .string()
    .trim()
    .length(21, "Room ID must contain exactly 21 characters"),
  category: CategoryEnum,
  maximumPoints: z.number().min(80).max(200),
  maximumNumberOfPlayers: z.number().min(2).max(10),
});
