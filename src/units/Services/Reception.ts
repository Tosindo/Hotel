import { DecimalOne, DecimalZero } from "../../engine/constants";
import { createModifierNode } from "../../engine/createCalculationNode";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";
import { displayable, staticDisplayable } from "../../middlewares/displayable";
import { purchasable } from "../../middlewares/purchasable";
import { unlockable } from "../../middlewares/unlockable";
import { NODE_PRIORITY } from "../../priorities";
import { Global } from "../System/Global";

const Reception = createUnitBlueprint(
  "reception",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.SERVICE,

          getNodes() {
            return {
              unlockCheckIn: createModifierNode({
                priority: NODE_PRIORITY.INITIAL,
                targets: [Global.key.getComputedValueKey("unlockedCheckIn")],
                calculate: () => ({
                  [Global.key.getComputedValueKey("unlockedCheckIn")]: true,
                }),
              }),
            };
          },
        },
        staticDisplayable({
          name: "Reception",
          description:
            "For guests to check in and out you move your kitchen table to the cramped hallway and sit there with a pen and paper. Very professional.",
          sprite: "checkIn",
        })
      ),
      {
        costFormula: () => DecimalZero,
        maxFormula: () => DecimalOne,
        singlePurchase: true,
        customPurchaseText: "Move table",
      }
    ),
    {
      unlockCondition(state) {
        return Boolean(Global.key.getState(state)?.availableGuests.gte(1));
      },
    }
  )
);

export { Reception };
