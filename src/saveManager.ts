import lz from "lz-string";
import Decimal from "break_infinity.js";
import { useHotelStore } from "./hotelStore";

interface SaveState {
  money: string;
  purchasedUpgrades: string[];
  hiredReceptionists: string;
  hiredCleaners: string;

  cleanRooms: string;
  occupiedRooms: string;
  dirtyRooms: string;

  pendingCheckins: string;
  pendingCleanings: string;

  // Room counts
  singleRooms: string;
  doubleRooms: string;
  tripleRooms: string;
  quadRooms: string;
  penthouseRooms: string;

  // We also need to save the checkout timer's start time to persist progress
  checkoutCycleStartTime: number;
}

const SAVE_KEY = "idleHotelSave";

export function saveGame() {
  const state = useHotelStore.getState();

  // 1. Create a plain object with only the data we want to save.
  //    Crucially, convert all Decimal instances to strings.
  const saveState: SaveState = {
    money: state.money.toString(),
    purchasedUpgrades: state.purchasedUpgrades,
    hiredReceptionists: state.hiredReceptionists.toString(),
    hiredCleaners: state.hiredCleaners.toString(),
    singleRooms: state.singleRooms.toString(),
    doubleRooms: state.doubleRooms.toString(),
    tripleRooms: state.tripleRooms.toString(),
    quadRooms: state.quadRooms.toString(),
    penthouseRooms: state.penthouseRooms.toString(),
    checkoutCycleStartTime: state.checkoutCycleStartTime,
    cleanRooms: state.cleanRooms.toString(),
    occupiedRooms: state.occupiedRooms.toString(),
    dirtyRooms: state.dirtyRooms.toString(),
    pendingCheckins: state.pendingCheckins.toString(),
    pendingCleanings: state.pendingCleanings.toString(),
  };

  // 2. Serialize, compress, and save to localStorage.
  const jsonString = JSON.stringify(saveState);
  const compressedString = lz.compressToBase64(jsonString);
  localStorage.setItem(SAVE_KEY, compressedString);
  console.log("Game Saved!", new Date().toLocaleTimeString());
}

export function loadGame(saveString?: string) {
  try {
    const compressedString = saveString ?? localStorage.getItem(SAVE_KEY);
    if (!compressedString) {
      console.log("No save file found.");
      return;
    }

    // 1. Decompress and parse the saved data.
    const jsonString = lz.decompressFromBase64(compressedString);
    const loadedState: SaveState = JSON.parse(jsonString);

    // 2. "Hydrate" the state: Convert strings back into Decimal objects.
    //    We also calculate offline progress here.
    const now = Date.now();
    const offlineTime = now - loadedState.checkoutCycleStartTime; // in ms

    useHotelStore.setState({
      money: new Decimal(loadedState.money),
      purchasedUpgrades: loadedState.purchasedUpgrades ?? [],
      hiredReceptionists: new Decimal(loadedState.hiredReceptionists ?? 0),
      hiredCleaners: new Decimal(loadedState.hiredCleaners ?? 0),
      singleRooms: new Decimal(loadedState.singleRooms ?? 0),
      doubleRooms: new Decimal(loadedState.doubleRooms ?? 0),
      tripleRooms: new Decimal(loadedState.tripleRooms ?? 0),
      quadRooms: new Decimal(loadedState.quadRooms ?? 0),
      penthouseRooms: new Decimal(loadedState.penthouseRooms ?? 0),

      cleanRooms: new Decimal(loadedState.cleanRooms ?? 0),
      occupiedRooms: new Decimal(loadedState.occupiedRooms ?? 0),
      dirtyRooms: new Decimal(loadedState.dirtyRooms ?? 0),
      pendingCheckins: new Decimal(loadedState.pendingCheckins ?? 0),
      pendingCleanings: new Decimal(loadedState.pendingCleanings ?? 0),

      // Important: Set the checkout start time to `now` minus the remaining cycle time
      // This preserves the progress bar's position.
      checkoutCycleStartTime:
        now -
        (offlineTime % (useHotelStore.getState().checkoutCycleDuration * 1000)),
    });

    // Post-load calculations (like offline income) could go here.
    // For simplicity, we'll skip complex offline income for now.

    console.log("Game Loaded!");
  } catch (error) {
    console.error("Failed to load save game:", error);
    // Optionally, clear the bad save file
    // localStorage.removeItem(SAVE_KEY);
  }
}
