import Decimal from "break_infinity.js";
import { DecimalOne, DecimalZero } from "../../engine/constants";
import {
  createModifierNode,
  createValueNode,
} from "../../engine/createCalculationNode";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";
import { displayable, staticDisplayable } from "../../middlewares/displayable";
import { purchasable } from "../../middlewares/purchasable";
import { NODE_PRIORITY } from "../../priorities";
import { Global } from "../System/Global";
import { DoubleRoom, SingleRoom } from "../Rooms";
import { defaultUnlockCondition, UnlockManager } from "../System/UnlockManager";
import { unlockable } from "../../middlewares/unlockable";

const AbandonedRoadsideMotel = createUnitBlueprint(
  "abandonedRoadsideMotel",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.BUILDING,

          // No additional nodes for now
          getNodes(key) {
            return {
              potentialIncome: createValueNode({
                priority: NODE_PRIORITY.INITIAL,
                returnType: "decimal",
                calculate: () => DecimalZero,
              }),

              potentialIncomeOnGlobal: createModifierNode({
                priority: NODE_PRIORITY.BUILDING_MODIFY,
                dependencies: [
                  Global.key.getComputedValueKey("potentialIncome"),
                  key.getComputedValueKey("potentialIncome"),
                ],
                targets: [Global.key.getComputedValueKey("potentialIncome")],
                calculate(state) {
                  const globalPotentialIncome = Global.key.getComputedDecimal(
                    state,
                    "potentialIncome"
                  );
                  const buildingPotentialIncome = key.getComputedDecimal(
                    state,
                    "potentialIncome"
                  );

                  return {
                    [Global.key.getComputedValueKey("potentialIncome")]:
                      globalPotentialIncome.add(buildingPotentialIncome),
                  };
                },
              }),

              maxSingleRooms: createModifierNode({
                priority: NODE_PRIORITY.BUILDING_MODIFY,
                dependencies: [SingleRoom.key.getComputedValueKey("max")],
                targets: [SingleRoom.key.getComputedValueKey("max")],
                calculate(state) {
                  const max = SingleRoom.key.getComputedDecimal(state, "max");

                  return {
                    [SingleRoom.key.getComputedValueKey("max")]: max.add(
                      new Decimal(10)
                    ),
                  };
                },
              }),

              maxDoubleRooms: createModifierNode({
                priority: NODE_PRIORITY.BUILDING_MODIFY,
                dependencies: [DoubleRoom.key.getComputedValueKey("max")],
                targets: [DoubleRoom.key.getComputedValueKey("max")],
                calculate(state) {
                  const max = DoubleRoom.key.getComputedDecimal(state, "max");

                  return {
                    [DoubleRoom.key.getComputedValueKey("max")]: max.add(
                      new Decimal(5)
                    ),
                  };
                },
              }),
            };
          },
        },
        staticDisplayable({
          name: "Abandoned Roadside Motel",
          description:
            "An old and abandoned roadside motel. You could expand your hotel with it but will need some major renovations first.",
          tooltipContent:
            "Total of 10 single rooms and 5 double rooms. Minimal services.",
          sprite: "unknown",
        })
      ),
      {
        costFormula: () => new Decimal(500),
        maxFormula: () => DecimalOne,
        singlePurchase: true,

        onPurchase: (_g, _u, _q, { dispatchAction }) => {
          dispatchAction(
            UnlockManager.key,
            "unlockUnit",
            SingleRoom.key.toString()
          );
          dispatchAction(
            UnlockManager.key,
            "unlockUnit",
            DoubleRoom.key.toString()
          );
        },
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const AbandonedRoadsideMotelUnits = [AbandonedRoadsideMotel];

export { AbandonedRoadsideMotelUnits, AbandonedRoadsideMotel };
