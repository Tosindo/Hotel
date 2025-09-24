import { DecimalOne, DecimalZero } from "../../engine/constants";
import { createModifierNode } from "../../engine/createCalculationNode";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";
import { displayable, staticDisplayable } from "../../middlewares/displayable";
import { purchasable } from "../../middlewares/purchasable";
import { unlockable } from "../../middlewares/unlockable";
import { NODE_PRIORITY } from "../../priorities";
import { Global } from "../System/Global";

const CleaningSoap = createUnitBlueprint(
  "cleaningSoap",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.SERVICE,

          getNodes() {
            return {
              unlockCleaning: createModifierNode({
                priority: NODE_PRIORITY.INITIAL,
                targets: [Global.key.getComputedValueKey("unlockedCleaning")],
                calculate: () => ({
                  [Global.key.getComputedValueKey("unlockedCleaning")]: true,
                }),
              }),
            };
          },
        },
        staticDisplayable({
          name: "Cleaning Soap",
          description:
            "You got to clean the rooms to let more guests in. You found a bar of soap in the bathroom, this will do for now.",
          sprite: "checkIn",
        })
      ),
      {
        costFormula: () => DecimalZero,
        maxFormula: () => DecimalOne,
        singlePurchase: true,
        customPurchaseText: "Start the art of cleaning",
      }
    ),
    {
      unlockCondition(state) {
        return Boolean(Global.key.getState(state)?.dirtyRooms.gte(1));
      },
    }
  )
);

export { CleaningSoap };
