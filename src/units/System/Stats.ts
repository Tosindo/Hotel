import { DecimalOne } from "../../engine/constants";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";

const Stats = createUnitBlueprint("stats", {
  type: UnitType.SYSTEM,

  getInitialState() {
    return {
      firstCheckInDone: false as boolean,
    };
  },

  initialize(k, _s, { updateCount }) {
    updateCount(k, DecimalOne);
  },
});

export { Stats };
