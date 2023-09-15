import { Player } from "../../types/Player";

const avatar = {
  eyeType: "Side",
  accessoriesType: "Prescription02",
  topType: "WinterHat2",
  hairColor: "Red",
  facialHairType: "MoustacheFancy",
  clotheType: "ShirtCrewNeck",
  eyebrowType: "RaisedExcitedNatural",
  mouthType: "Concerned",
  skinColor: "Black",
};

export const mockPlayer: Player = {
  nickName: "TestPlayer",
  id: "Vws9v-Wegjx4bvBKAAAA",
  isPlayerTurn: false,
  playerGuessedRight: false,
  points: 0,
  avatar,
};
