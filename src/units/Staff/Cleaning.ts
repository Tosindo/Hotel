import Decimal from "break_infinity.js";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";
import { createValueNode } from "../../engine/createCalculationNode";
import { NODE_PRIORITY } from "../../priorities";
import { DecimalOne, DecimalZero } from "../../engine/constants";
import { Global } from "../System/Global";

const Cleaning = createUnitBlueprint("cleaning", {
  type: UnitType.SYSTEM,

  getInitialState() {
    return {
      pendingCleanings: new Decimal(0),
    };
  },

  getNodes() {
    return {
      cleaningRate: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => DecimalZero,
      }),
    };
  },

  tick(key, deltaTime, gameState, { updateState }) {
    const cleaningRate = key.getComputedDecimal(gameState, "cleaningRate");
    const state = key.getState(gameState);
    const globalState = Global.key.getState(gameState);

    if (!state || !globalState || cleaningRate.eq(0)) return;

    if (globalState.dirtyRooms.eq(0)) {
      if (state.pendingCleanings.gt(0)) {
        updateState(key, (s) => ({
          ...s,
          pendingCleanings: DecimalZero,
        }));
      }
      return;
    }

    const newPendingCleanings = state.pendingCleanings.add(
      cleaningRate.mul(deltaTime)
    );
    const wholeCleanings = newPendingCleanings.floor();

    if (wholeCleanings.gt(0)) {
      const actualCleanings = Decimal.min(
        wholeCleanings,
        globalState.dirtyRooms
      );

      updateState(Global.key, (s) => ({
        ...s,
        dirtyRooms: s.dirtyRooms.sub(actualCleanings),
      }));
      updateState(key, (s) => ({
        ...s,
        pendingCleanings: newPendingCleanings.sub(wholeCleanings),
      }));
    } else {
      updateState(key, (s) => ({
        ...s,
        pendingCleanings: newPendingCleanings,
      }));
    }
  },

  initialize(k, _s, { updateCount }) {
    updateCount(k, DecimalOne);
  },
});

export { Cleaning };
