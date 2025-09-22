import { useEffect, useRef } from "react";
import { getGameStateSaveFromLocalStorage } from "../utils/saveManager";
import { useEngine } from "../engine/EngineContext";

const useAutosave = () => {
  const engine = useEngine();

  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const saveState = getGameStateSaveFromLocalStorage();
    if (!saveState) return;

    engine.loadGameState(saveState);
  }, [engine]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      const saveState = engine.getSaveGameState();
      if (!saveState) return;
      localStorage.setItem("idleHotelSave", JSON.stringify(saveState));
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [engine]);
};

export { useAutosave };
