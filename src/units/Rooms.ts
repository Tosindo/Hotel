import Decimal from "break_infinity.js";
import { createUnitBlueprint } from "../engine/createUnitBlueprint";
import { UnitType } from "../engine/types";
import {
  geometricProgressionPurchase,
  purchasable,
} from "../middlewares/purchasable";
import { roomify } from "../middlewares/roomify";
import { DecimalZero } from "../engine/constants";
import { unlockable } from "../middlewares/unlockable";
import { defaultUnlockCondition } from "./UnlockManager";

const SingleRoom = createUnitBlueprint(
  "singleRoom",
  unlockable(
    roomify(
      purchasable(
        {
          name: "Single Room",
          description: "A small room for a lonely guest.",
          sprite: "singleRoom",
          type: UnitType.ROOM,

          // No additional nodes for now
          getNodes() {
            return {};
          },
        },
        {
          ...geometricProgressionPurchase(new Decimal(5), new Decimal(1.1)),
          costFormula: (state, key) => {
            const owned = key.getCount(state);
            const baseCost = key.getComputedDecimal(state, "baseCost");
            const growthRate = key.getComputedDecimal(state, "growthRate");

            return owned.eq(0)
              ? DecimalZero
              : baseCost.mul(growthRate.pow(owned.sub(1)));
          },

          maxFormula: () => new Decimal(10),
        }
      ),
      {
        individualValueFormula: () => new Decimal(0.1),
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const DoubleRoom = createUnitBlueprint(
  "doubleRoom",
  unlockable(
    roomify(
      purchasable(
        {
          name: "Double Room",
          description: "A comfortable room for two guests.",
          sprite: "doubleRoom",
          type: UnitType.ROOM,

          // No additional nodes for now
          getNodes() {
            return {};
          },
        },
        {
          ...geometricProgressionPurchase(new Decimal(10), new Decimal(1.1)),
          maxFormula: () => new Decimal(7),
        }
      ),
      {
        individualValueFormula: () => new Decimal(0.5),
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const TripleRoom = createUnitBlueprint(
  "tripleRoom",
  unlockable(
    roomify(
      purchasable(
        {
          name: "Triple Room",
          description: "A spacious room for three guests.",
          sprite: "tripleRoom",
          type: UnitType.ROOM,

          // No additional nodes for now
          getNodes() {
            return {};
          },
        },
        {
          ...geometricProgressionPurchase(new Decimal(50), new Decimal(1.1)),
          maxFormula: () => new Decimal(5),
        }
      ),
      {
        individualValueFormula: () => new Decimal(2),
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const QuadRoom = createUnitBlueprint(
  "quadRoom",
  unlockable(
    roomify(
      purchasable(
        {
          name: "Quad Room",
          description: "A large room for four guests.",
          sprite: "quadRoom",
          type: UnitType.ROOM,

          // No additional nodes for now
          getNodes() {
            return {};
          },
        },
        {
          ...geometricProgressionPurchase(new Decimal(100), new Decimal(1.1)),
          maxFormula: () => new Decimal(3),
        }
      ),
      {
        individualValueFormula: () => new Decimal(10),
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const PenthouseRoom = createUnitBlueprint(
  "penthouseRoom",
  unlockable(
    roomify(
      purchasable(
        {
          name: "Penthouse Room",
          description:
            "A luxurious room with a stunning view, sometimes, most times it is not.",
          sprite: "penthouseRoom",
          type: UnitType.ROOM,

          // No additional nodes for now
          getNodes() {
            return {};
          },
        },
        {
          ...geometricProgressionPurchase(new Decimal(500), new Decimal(1.1)),
          maxFormula: () => new Decimal(1),
        }
      ),
      {
        individualValueFormula: () => new Decimal(50),
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const Rooms = [SingleRoom, DoubleRoom, TripleRoom, QuadRoom, PenthouseRoom];

export { SingleRoom, DoubleRoom, TripleRoom, QuadRoom, PenthouseRoom, Rooms };
