import { useMemo } from "react";
import { useEngine } from "../engine/EngineContext";
import type { UnitType } from "../engine/types";
import { useUnlockedUnits } from "./useUnlockedUnits";
import { useUnitsComputedValue } from "./useUnitsComputedValue";
import { useUnitsEngineSelector } from "./useUnitsEngineSelector";
import { DecimalOne, DecimalZero } from "../engine/constants";

export interface UseListUnitsOptions {
  type: UnitType;
  sortBy?:
    | "cost"
    | "cost10"
    | "cost100"
    | "cost1000"
    | "costMaxAffordable"
    | "baseCost";
}

const useListUnits = ({ type, sortBy = "cost" }: UseListUnitsOptions) => {
  const engine = useEngine();
  const unlockedUnits = useUnlockedUnits();

  const baseUnits = useMemo(() => {
    const allUnits = engine.getBlueprints();
    const typeUnits = allUnits.filter(
      (unit) =>
        unit.type === type &&
        !unit.hidden &&
        (unit.metadata?.unlockable !== true ||
          unlockedUnits.has(unit.key.toString()))
    );

    return typeUnits;
  }, [engine, type, unlockedUnits]);

  const unitSortValue = useUnitsComputedValue(baseUnits, "decimal", sortBy);

  const unitCount = useUnitsEngineSelector(
    baseUnits.map((u) => u.key.getCountKey()),
    baseUnits,
    (engine, unit) => {
      return engine.getUnitCount(unit.key);
    }
  );

  const sortedUnits = useMemo(() => {
    return [...baseUnits].sort((a, b) => {
      const aCount = unitCount.get(a.key.toString()) || DecimalZero;
      const bCount = unitCount.get(b.key.toString()) || DecimalZero;

      const aSinglePurchased =
        a.metadata?.singlePurchase === true && aCount.gte(DecimalOne);
      const bSinglePurchased =
        b.metadata?.singlePurchase === true && bCount.gte(DecimalOne);

      if (aSinglePurchased && !bSinglePurchased) return 1;
      if (!aSinglePurchased && bSinglePurchased) return -1;

      const aValue = unitSortValue.get(a.key.toString());
      const bValue = unitSortValue.get(b.key.toString());

      if (aValue && bValue) {
        return aValue.cmp(bValue);
      }
      if (aValue) return -1;
      if (bValue) return 1;
      return 0;
    });
  }, [baseUnits, unitSortValue, unitCount]);

  return sortedUnits;
};

export { useListUnits };
