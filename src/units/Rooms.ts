import Decimal from "break_infinity.js";
import { createUnitBlueprint } from "../engine/createUnitBlueprint";
import { UnitType } from "../engine/types";
import {
  geometricProgressionPurchase,
  purchasable,
} from "../middlewares/purchasable";
import { roomify } from "../middlewares/roomify";
import { unlockable } from "../middlewares/unlockable";
import { defaultUnlockCondition } from "./System/UnlockManager";
import { displayable, staticDisplayable } from "../middlewares/displayable";

const SingleRoom = createUnitBlueprint(
  "singleRoom",
  unlockable(
    roomify(
      purchasable(
        displayable(
          {
            type: UnitType.ROOM,

            // No additional nodes for now
            getNodes() {
              return {};
            },
          },
          staticDisplayable({
            name: "Single Room",
            description: "A small room for a lonely guest.",
            sprite: "singleRoom",
          })
        ),
        {
          ...geometricProgressionPurchase(new Decimal(80), new Decimal(1.15)),

          maxFormula: () => new Decimal(0),
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

const DoubleRoom = createUnitBlueprint(
  "doubleRoom",
  unlockable(
    roomify(
      purchasable(
        displayable(
          {
            type: UnitType.ROOM,

            // No additional nodes for now
            getNodes() {
              return {};
            },
          },
          staticDisplayable({
            name: "Double Room",
            description: "A comfortable room for two guests.",
            sprite: "doubleRoom",
          })
        ),
        {
          ...geometricProgressionPurchase(new Decimal(150), new Decimal(1.1)),
          maxFormula: () => new Decimal(0),
        }
      ),
      {
        individualValueFormula: () => new Decimal(25),
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
        displayable(
          {
            type: UnitType.ROOM,

            // No additional nodes for now
            getNodes() {
              return {};
            },
          },
          staticDisplayable({
            name: "Triple Room",
            description: "A spacious room for three guests.",
            sprite: "tripleRoom",
          })
        ),
        {
          ...geometricProgressionPurchase(new Decimal(50), new Decimal(1.1)),
          maxFormula: () => new Decimal(0),
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
        displayable(
          {
            type: UnitType.ROOM,

            // No additional nodes for now
            getNodes() {
              return {};
            },
          },
          staticDisplayable({
            name: "Quad Room",
            description: "A large room for four guests.",
            sprite: "quadRoom",
          })
        ),
        {
          ...geometricProgressionPurchase(new Decimal(100), new Decimal(1.1)),
          maxFormula: () => new Decimal(0),
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
        displayable(
          {
            type: UnitType.ROOM,

            // No additional nodes for now
            getNodes() {
              return {};
            },
          },
          staticDisplayable({
            name: "Penthouse Room",
            description:
              "A luxurious room with a stunning view, sometimes, most times it is not.",
            sprite: "penthouseRoom",
          })
        ),
        {
          ...geometricProgressionPurchase(new Decimal(500), new Decimal(1.1)),
          maxFormula: () => new Decimal(0),
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

const DefaultRooms = [
  SingleRoom,
  DoubleRoom,
  TripleRoom,
  QuadRoom,
  PenthouseRoom,
];

export {
  SingleRoom,
  DoubleRoom,
  TripleRoom,
  QuadRoom,
  PenthouseRoom,
  DefaultRooms,
};
