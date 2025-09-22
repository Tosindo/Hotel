import { DecimalOne, DecimalZero } from "../engine/constants";
import { createUnitBlueprint } from "../engine/createUnitBlueprint";
import { UnitType, type GameState } from "../engine/types";
import type { UnitKey } from "../engine/UnitKey";
import { isFunction } from "../utils/guards";
import { Global } from "./Global";

export const defaultUnlockCondition =
  (customCondition?: (state: GameState, key: UnitKey) => boolean) =>
  (state: GameState, key: UnitKey) => {
    const owned = key.getCount(state);
    const cost = key.getComputedDecimal(state, "cost");
    const money = Global.key.getState(state)?.money ?? DecimalZero;

    return (
      (owned.gt(0) || cost.lte(DecimalZero) || money.gte(cost)) &&
      (customCondition?.(state, key) ?? true)
    );
  };

const UnlockManager = createUnitBlueprint("unlockManager", {
  type: UnitType.SYSTEM,

  getInitialState() {
    return {
      unlockedUnits: [] as string[],
    };
  },

  getActions(key, _, { updateState }) {
    return {
      unlockUnit: (unitKey: string) => {
        updateState(key, (state) => {
          if (!state.unlockedUnits.includes(unitKey)) {
            return {
              ...state,
              unlockedUnits: [...state.unlockedUnits, unitKey],
            };
          }
          return state;
        });
      },
    };
  },

  tick(key, _, state, { dispatchAction }) {
    const selfState = key.getState(state);
    if (!selfState) return;

    const unlockedSet = new Set(selfState.unlockedUnits);

    for (const blueprint of state.blueprints) {
      if (unlockedSet.has(blueprint.key.toString())) continue;

      const condition = blueprint.metadata?.unlockCondition;
      if (
        condition &&
        isFunction(condition) &&
        Boolean(condition(state, blueprint.key))
      ) {
        dispatchAction(key, "unlockUnit", blueprint.key.toString());
      }
    }
  },

  initialize(k, _s, { updateCount }) {
    updateCount(k, DecimalOne);
  },
});

export { UnlockManager };
