import type {
  ComputableValueFromReturnType,
  ReturnTypes,
  UnitBlueprint,
} from "../engine/types";
import { validateComputedValue } from "../engine/validateComputedValue";
import { useMemo } from "react";
import { useUnitsEngineSelector } from "./useUnitsEngineSelector";

export const useUnitsComputedValue = <
  R extends ReturnTypes,
  T = ComputableValueFromReturnType<R>,
>(
  units: UnitBlueprint[],
  returnType: R,
  valueKey: string
) => {
  const dependencies = useMemo(
    () => units.map((u) => u.key.getComputedValueKey(valueKey)),
    [units, valueKey]
  );

  return useUnitsEngineSelector<T>(dependencies, units, (engine, unit) => {
    const value = engine.getComputedValue(unit.key, valueKey);
    if (!validateComputedValue(returnType, value)) {
      return undefined;
    }
    return value as T;
  });
};
