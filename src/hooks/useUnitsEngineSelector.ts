import type { Engine } from "../engine/Engine";
import type { DependencyKey, UnitBlueprint } from "../engine/types";
import { useEngineSelector } from "../engine/useEngineSelector";
import { useRef } from "react";

export const useUnitsEngineSelector = <T>(
  dependencies: DependencyKey[],
  units: UnitBlueprint[],
  getValue: (engine: Engine, unit: UnitBlueprint) => T | undefined
) => {
  const lastMapRef = useRef<Map<string, T> | null>(null);

  const values = useEngineSelector(dependencies, (engine) => () => {
    const newMap = new Map<string, T>();
    for (const unit of units) {
      const value = getValue(engine, unit);
      if (value === undefined) continue;

      newMap.set(unit.key.toString(), value as T);
    }

    const prev = lastMapRef.current;
    if (prev && prev.size === newMap.size) {
      let same = true;
      for (const [k, v] of newMap) {
        if (!prev.has(k) || !Object.is(prev.get(k), v)) {
          same = false;
          break;
        }
      }
      if (same) {
        return prev;
      }
    }

    lastMapRef.current = newMap;
    return newMap;
  });

  return values;
};
