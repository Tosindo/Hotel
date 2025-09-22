import type { UnitBlueprint } from "./engine/types";
import { OwnRoomUnits } from "./units/Buildings/YourAppartment";
import { Global } from "./units/Global";
import { Cleaning } from "./units/Staff/Cleaning";
import { Receptionist } from "./units/Staff/Receptionist";
import { UnlockManager } from "./units/UnlockManager";

export const GAME_VERSION = "0.0.2";

const blueprints: UnitBlueprint[] = [
  Global,
  UnlockManager,
  Cleaning,
  Receptionist,
  ...OwnRoomUnits,
  //...Rooms,
];

export { blueprints };
