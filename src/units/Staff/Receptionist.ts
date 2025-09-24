import Decimal from "break_infinity.js";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";
import { createValueNode } from "../../engine/createCalculationNode";
import { NODE_PRIORITY } from "../../priorities";
import { DecimalOne, DecimalZero } from "../../engine/constants";
import { Global } from "../System/Global";

const Receptionist = createUnitBlueprint("receptionist", {
  type: UnitType.SYSTEM,

  getInitialState() {
    return {
      pendingCheckIns: new Decimal(0),
    };
  },

  getNodes() {
    return {
      checkInRate: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => DecimalZero,
      }),
    };
  },

  tick(key, deltaTime, gameState, { updateState }) {
    const checkInRate = key.getComputedDecimal(gameState, "checkInRate");
    const cleanRooms = Global.key.getComputedDecimal(gameState, "cleanRooms");
    const state = key.getState(gameState);
    const globalState = Global.key.getState(gameState);

    if (!state || !globalState || checkInRate.eq(0)) return;

    if (cleanRooms.eq(0)) {
      if (state.pendingCheckIns.gt(0)) {
        updateState(key, (s) => ({
          ...s,
          pendingCheckIns: DecimalZero,
        }));
      }
      return;
    }

    const newPendingCheckIns = state.pendingCheckIns.add(
      checkInRate.mul(deltaTime)
    );

    const wholeCheckIns = newPendingCheckIns.floor();

    if (wholeCheckIns.gt(0)) {
      const actualCheckIns = Decimal.min(wholeCheckIns, cleanRooms);

      updateState(Global.key, (s) => ({
        ...s,
        occupiedRooms: s.occupiedRooms.add(actualCheckIns),
      }));
      updateState(key, (s) => ({
        ...s,
        pendingCheckIns: newPendingCheckIns.sub(wholeCheckIns),
      }));
    } else {
      updateState(key, (s) => ({
        ...s,
        pendingCheckIns: newPendingCheckIns,
      }));
    }
  },

  initialize(k, _s, { updateCount }) {
    updateCount(k, DecimalOne);
  },
});

export { Receptionist };
