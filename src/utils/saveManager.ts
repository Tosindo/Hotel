import lz from "lz-string";
import type { SaveGameState } from "../engine/types";
import { useSettingsStore } from "../settingsStore";
import Decimal from "break_infinity.js";

export const SAVE_KEY = "enginedIdleHotelSave";

type SerializedDecimal = {
  __type: "Decimal";
  value: string;
};

const isSerializedDecimal = (value: unknown): value is SerializedDecimal => {
  return (
    typeof value === "object" &&
    value !== null &&
    "__type" in value &&
    (value as SerializedDecimal).__type === "Decimal" &&
    "value" in value &&
    typeof (value as SerializedDecimal).value === "string"
  );
};

const replacer = (_key: string, value: unknown) => {
  if (value instanceof Decimal) {
    console.log(`✅ Serializing Decimal at key: '${_key}'`);
    return { __type: "Decimal", value: value.toString() };
  }

  if (_key && typeof value !== "object" && !isNaN(Number(value))) {
    console.log(`⚠️ Found non-Decimal number/string at key: '${_key}'`, value);
  }
  return value;
};

const reviver = (_key: string, value: unknown) => {
  if (isSerializedDecimal(value)) {
    return new Decimal(value.value);
  }
  return value;
};

const getGameStateSaveFromLocalStorage = () => {
  const compressedSave = localStorage.getItem(SAVE_KEY);
  if (!compressedSave) return null;

  return getGameStateFromCompressedString(compressedSave);
};

const getGameStateFromCompressedString = (
  compressedString: string
): SaveGameState | null => {
  try {
    const jsonString = lz.decompressFromBase64(compressedString);
    if (!jsonString) return null;

    const loadedState: SaveGameState = JSON.parse(jsonString, reviver);

    if (loadedState.gameVersion === "0.0.1" || !loadedState.gameVersion)
      return null;

    console.log(loadedState);

    useSettingsStore.getState().setLastSaveAt(loadedState.lastSavedTime);

    // @TODO - validate loadedState structure here if needed
    return loadedState;
  } catch (error) {
    console.error("Failed to load game state from compressed string:", error);
    return null;
  }
};

const getCompressedStringFromGameState = (state: SaveGameState): string => {
  const originalToJSON = Decimal.prototype.toJSON;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (Decimal.prototype as any).toJSON;
  const jsonString = JSON.stringify(state, replacer);
  Decimal.prototype.toJSON = originalToJSON;

  console.log("Saving state:", state, jsonString);
  return lz.compressToBase64(jsonString);
};

const saveGameStateToLocalStorage = (state: SaveGameState) => {
  const compressedString = getCompressedStringFromGameState(state);
  localStorage.setItem(SAVE_KEY, compressedString);

  useSettingsStore.getState().setLastSaveAt(state.lastSavedTime);

  return compressedString;
};

export {
  getGameStateSaveFromLocalStorage,
  getGameStateFromCompressedString,
  getCompressedStringFromGameState,
  saveGameStateToLocalStorage,
};
