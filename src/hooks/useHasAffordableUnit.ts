import { useEngine } from "../engine/EngineContext";
import type { UnitType } from "../engine/types";
import { useMoney } from "./useMoney";
import { useUnitsComputedValue } from "./useUnitsComputedValue";
import { useUnitsEngineSelector } from "./useUnitsEngineSelector";
import { useUnlockedUnits } from "./useUnlockedUnits";
import { useMemo } from "react";

const useHasAffordableUnit = (type: UnitType) => {
  const engine = useEngine();
  const unlockedUnits = useUnlockedUnits();
  const money = useMoney();

  /**
   * @TODO - don't repeat the same damn code as useListUnits
   */
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

  const unitCost = useUnitsComputedValue(baseUnits, "decimal", "cost");
  const unitMax = useUnitsComputedValue(baseUnits, "decimal", "max");
  const unitCount = useUnitsEngineSelector(
    baseUnits.map((u) => u.key.getCountKey()),
    baseUnits,
    (engine, unit) => {
      return engine.getUnitCount(unit.key);
    }
  );

  return useMemo(() => {
    for (const unit of baseUnits) {
      const cost = unitCost.get(unit.key.toString());
      const max = unitMax.get(unit.key.toString());
      const count = unitCount.get(unit.key.toString());

      if (max && count && count.gte(max)) {
        continue;
      }

      if (cost && (money.gte(cost) || cost.lte(0))) {
        return true;
      }
    }

    return false;
  }, [baseUnits, money, unitCost, unitCount, unitMax]);
};

export { useHasAffordableUnit };
