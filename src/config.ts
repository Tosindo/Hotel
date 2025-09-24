import type { UnitBlueprint } from "./engine/types";
import { ParentsAppartmentUnits } from "./units/Buildings/ParentsAppartment";
import { Global } from "./units/System/Global";
import { Cleaning } from "./units/Staff/Cleaning";
import { Receptionist } from "./units/Staff/Receptionist";
import { UnlockManager } from "./units/System/UnlockManager";
import { AbandonedRoadsideMotelUnits } from "./units/Buildings/AbandonedMotel";
import { DefaultRooms } from "./units/Rooms";
import { Stats } from "./units/System/Stats";
import { HandOutFlyers, PenAndPaper } from "./units/Services/PenAndPaper";
import { Sound } from "./units/System/Sound";
import { Reception } from "./units/Services/Reception";
import { CleaningSoap } from "./units/Services/CleaningSoap";

export const GAME_VERSION = "0.0.2";

const blueprints: UnitBlueprint[] = [
  Global,
  UnlockManager,
  Stats,
  HandOutFlyers,
  Sound,
  Cleaning,
  Receptionist,
  PenAndPaper,
  Reception,
  CleaningSoap,
  ...ParentsAppartmentUnits,
  ...AbandonedRoadsideMotelUnits,
  ...DefaultRooms,
];

export { blueprints };
