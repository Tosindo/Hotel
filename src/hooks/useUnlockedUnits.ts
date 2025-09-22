import { useMemo } from "react";
import { useEngineSelector } from "../engine/useEngineSelector";
import { UnlockManager } from "../units/UnlockManager";

const useUnlockedUnits = () => {
  const unlockedUnits = useEngineSelector(
    [UnlockManager.key.getStateValueKey("unlockedUnits")],
    (engine) => () => engine.getStateValue(UnlockManager.key, "unlockedUnits")
  );

  return useMemo(() => {
    return new Set(unlockedUnits);
  }, [unlockedUnits]);
};

export { useUnlockedUnits };
