import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";
import {
  geometricProgressionPurchase,
  purchasable,
} from "../../middlewares/purchasable";
import { DecimalOne, DecimalZero } from "../../engine/constants";
import { roomify } from "../../middlewares/roomify";
import Decimal from "break_infinity.js";
import {
  createModifierNode,
  createValueNode,
} from "../../engine/createCalculationNode";
import { Global } from "../System/Global";
import { NODE_PRIORITY } from "../../priorities";
import { unlockable } from "../../middlewares/unlockable";
import { defaultUnlockCondition } from "../System/UnlockManager";
import { displayable, staticDisplayable } from "../../middlewares/displayable";
import { Cleaning } from "../Staff/Cleaning";
import { Receptionist } from "../Staff/Receptionist";

const ParentsAppartment = createUnitBlueprint(
  "parentsAppartment",
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
          };
        },
      },
      staticDisplayable({
        name: "Parents' House",
        description:
          "Your childhood home, now inherited from your parents. It feels empty without them. Low on cash, you could try renting out some rooms.",
        sprite: "unknown",
      })
    ),
    {
      costFormula: () => DecimalZero,
      maxFormula: () => DecimalOne,
      singlePurchase: true,
      customPurchaseText: "Move In",
    }
  )
);

const GuestRoom = createUnitBlueprint(
  "ownAppartmentGuestRoom",
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
            name: "The Guest Room",
            description:
              "Re-purpose your own parents' extra room to host guests and make some money on the side.",
            sprite: "singleRoom",
          })
        ),
        {
          costFormula: () => DecimalZero,
          maxFormula: () => DecimalOne,
          singlePurchase: true,
          customPurchaseText: "Prepare room",
        }
      ),
      {
        individualValueFormula: () => new Decimal(2),
        potentialIncomeKey: ParentsAppartment.key,
        potentialIncomeTarget: "potentialIncome",
      }
    ),
    {
      unlockCondition: defaultUnlockCondition((state) => {
        return ParentsAppartment.key.getCount(state).gte(1);
      }),
    }
  )
);

const LivingRoom = createUnitBlueprint(
  "ownAppartmentLivingRoom",
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
            name: "The Living Room",
            description:
              "The magic of plaster and paint can turn your living room into a double room, turning your apartment into a mini-hotel.",
            sprite: "doubleRoom",
          })
        ),
        {
          costFormula: () => new Decimal(100),
          maxFormula: () => DecimalOne,
          singlePurchase: true,
        }
      ),
      {
        individualValueFormula: () => new Decimal(10),
        potentialIncomeKey: ParentsAppartment.key,
        potentialIncomeTarget: "potentialIncome",
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const YourRoom = createUnitBlueprint(
  "ownAppartmentYourRoom",
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
            name: "Sacrifice Your Room",
            description:
              "Let go of your own comfort and turn your own bedroom into a double bunk bed room to host more guests. All for the greater good of the hotel.",
            sprite: "quadRoom",
          })
        ),
        {
          costFormula: () => new Decimal(200),
          maxFormula: () => DecimalOne,
          singlePurchase: true,
        }
      ),
      {
        individualValueFormula: () => new Decimal(30),
        potentialIncomeKey: ParentsAppartment.key,
        potentialIncomeTarget: "potentialIncome",
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const Jervasio = createUnitBlueprint(
  "jervasio",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.STAFF,

          getNodes() {
            return {
              cleaningRate: createModifierNode({
                dependencies: [
                  Cleaning.key.getComputedValueKey("cleaningRate"),
                ],
                targets: [Cleaning.key.getComputedValueKey("cleaningRate")],
                priority: NODE_PRIORITY.STAFF_MODIFY,
                calculate(state) {
                  const cleaningRate = Cleaning.key.getComputedDecimal(
                    state,
                    "cleaningRate"
                  );

                  return {
                    [Cleaning.key.getComputedValueKey("cleaningRate")]:
                      cleaningRate.add(0.1),
                  };
                },
              }),
              checkInRate: createModifierNode({
                dependencies: [
                  Receptionist.key.getComputedValueKey("checkInRate"),
                ],
                targets: [Receptionist.key.getComputedValueKey("checkInRate")],
                priority: NODE_PRIORITY.STAFF_MODIFY,
                calculate(state) {
                  const checkInRate = Receptionist.key.getComputedDecimal(
                    state,
                    "checkInRate"
                  );

                  return {
                    [Receptionist.key.getComputedValueKey("checkInRate")]:
                      checkInRate.add(0.2),
                  };
                },
              }),
            };
          },
        },
        staticDisplayable({
          name: "Jervasio",
          description:
            "Some homeless guy you found sleeping in your stairwell. You don't understand half of what he says, but he helps with cleaning and checking in guests.",
          tooltipContent:
            "Automatically cleans rooms and checks in guests. Albeit really slowly. Like, glacially slowly. I think he does it by pure chance, really.",
          sprite: "jervasio",
        })
      ),
      {
        costFormula: () => new Decimal(30),
        maxFormula: () => DecimalOne,
        singlePurchase: true,
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const HelpingHand = createUnitBlueprint(
  "theHelpingHand",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.UPGRADE,

          getNodes() {
            return {
              cleanRoomBoost: createModifierNode({
                dependencies: [
                  Global.key.getComputedValueKey("cleanRoomDuration"),
                ],
                targets: [Global.key.getComputedValueKey("cleanRoomDuration")],
                calculate(state) {
                  const cleanRoomDuration = Global.key.getComputedNumber(
                    state,
                    "cleanRoomDuration"
                  );

                  return {
                    [Global.key.getComputedValueKey("cleanRoomDuration")]:
                      cleanRoomDuration * 0.7,
                  };
                },
              }),
            };
          },
        },
        staticDisplayable({
          name: "The Helping Hand",
          description:
            "A literal, disembodied hand you found in a dusty box on the basement. After an exorcism it's suprisingly cheerful and an absolute demon at dusting and folding sheets.",
          tooltipContent: "Increases your cleaning speed by 30%.",
          sprite: "grabbingHand",
        })
      ),
      {
        costFormula: () => new Decimal(25),
        maxFormula: () => DecimalOne,
        singlePurchase: true,
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const LonelyFlower = createUnitBlueprint(
  "lonelyFlower",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.UPGRADE,

          getNodes() {
            return {
              guestRoomBoost: createModifierNode({
                dependencies: [
                  GuestRoom.key.getComputedValueKey("individualValue"),
                ],
                targets: [GuestRoom.key.getComputedValueKey("individualValue")],
                priority: NODE_PRIORITY.UPGRADE_MODIFY,
                calculate(state) {
                  const individualValue = GuestRoom.key.getComputedDecimal(
                    state,
                    "individualValue"
                  );

                  return {
                    [GuestRoom.key.getComputedValueKey("individualValue")]:
                      individualValue.add(2),
                  };
                },
              }),
            };
          },
        },
        staticDisplayable({
          name: "Lonely Flower",
          description:
            "Adds a single flower to the guest room, keeping company to all the lonely guests.",
          tooltipContent: "[Guest Room] Increases the room's value by 2.",
          sprite: "unknown",
        })
      ),
      {
        costFormula: () => new Decimal(15),
        maxFormula: () => DecimalOne,
        singlePurchase: true,
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

const CaffeinatedJitters = createUnitBlueprint(
  "caffeinatedJitters",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.UPGRADE,

          getNodes(key) {
            return {
              cleaningRateBoost: createModifierNode({
                dependencies: [
                  Cleaning.key.getComputedValueKey("cleaningRate"),
                  key.getCountKey(),
                ],
                targets: [Cleaning.key.getComputedValueKey("cleaningRate")],
                priority: NODE_PRIORITY.STAFF_MODIFY,
                calculate(state) {
                  const count = key.getCount(state);
                  const cleaningRate = Cleaning.key.getComputedDecimal(
                    state,
                    "cleaningRate"
                  );

                  return {
                    [Cleaning.key.getComputedValueKey("cleaningRate")]:
                      cleaningRate.mul(
                        new Decimal(1).add(new Decimal(0.1).mul(count))
                      ),
                  };
                },
              }),
              checkInRateBoost: createModifierNode({
                dependencies: [
                  Receptionist.key.getComputedValueKey("checkInRate"),
                  key.getCountKey(),
                ],
                targets: [Receptionist.key.getComputedValueKey("checkInRate")],
                priority: NODE_PRIORITY.STAFF_MODIFY,
                calculate(state) {
                  const count = key.getCount(state);
                  const checkInRate = Receptionist.key.getComputedDecimal(
                    state,
                    "checkInRate"
                  );

                  return {
                    [Receptionist.key.getComputedValueKey("checkInRate")]:
                      checkInRate.mul(
                        new Decimal(1).add(new Decimal(0.1).mul(count))
                      ),
                  };
                },
              }),
              cleanRoomEfficiencyBoost: createModifierNode({
                dependencies: [
                  Global.key.getComputedValueKey("cleanRoomEfficiency"),
                  key.getCountKey(),
                ],
                targets: [
                  Global.key.getComputedValueKey("cleanRoomEfficiency"),
                ],
                priority: NODE_PRIORITY.STAFF_MODIFY,
                calculate(state) {
                  const count = key.getCount(state);
                  const cleanRoomEfficiency = Global.key.getComputedDecimal(
                    state,
                    "cleanRoomEfficiency"
                  );

                  return {
                    [Global.key.getComputedValueKey("cleanRoomEfficiency")]:
                      cleanRoomEfficiency.mul(
                        new Decimal(1).add(new Decimal(0.1).mul(count))
                      ),
                  };
                },
              }),
              checkInEfficiencyBoost: createModifierNode({
                dependencies: [
                  Global.key.getComputedValueKey("checkInEfficiency"),
                  key.getCountKey(),
                ],
                targets: [Global.key.getComputedValueKey("checkInEfficiency")],
                priority: NODE_PRIORITY.STAFF_MODIFY,
                calculate(state) {
                  const count = key.getCount(state);
                  const checkInEfficiency = Global.key.getComputedDecimal(
                    state,
                    "checkInEfficiency"
                  );

                  return {
                    [Global.key.getComputedValueKey("checkInEfficiency")]:
                      checkInEfficiency.mul(
                        new Decimal(1).add(new Decimal(0.1).mul(count))
                      ),
                  };
                },
              }),
              cleanRoomDurationBoost: createModifierNode({
                dependencies: [
                  Global.key.getComputedValueKey("cleanRoomDuration"),
                  key.getCountKey(),
                ],
                targets: [Global.key.getComputedValueKey("cleanRoomDuration")],
                priority: NODE_PRIORITY.STAFF_MODIFY,
                calculate(state) {
                  const count = key.getCount(state);
                  const cleanRoomDuration = Global.key.getComputedNumber(
                    state,
                    "cleanRoomDuration"
                  );

                  return {
                    [Global.key.getComputedValueKey("cleanRoomDuration")]:
                      cleanRoomDuration * (1 - 0.1 * count.toNumber()),
                  };
                },
              }),
            };
          },
        },
        {
          name: () => "Caffeinated Jitters",
          description: (state, key) => {
            const count = key.getCount(state).toNumber();
            switch (count) {
              case 0:
                return "Buy a Braun Aromaster coffee machine from an abandoned house's auction for the staff room, your bedroom. It smells weird, tastes weird, but somehow you feel invigorated and jittery.";
              case 1:
                return "The coffee machine seems to be broken, but you feel like you can make it work better. You tinker with the buttons and levers, somehow making it even more jitter-inducing.";
              case 2:
                return "You find a manual online that explains how to modify the Braun Aromaster to brew even stronger coffee. You follow the instructions carefully, and now the coffee is so strong it feels like it's vibrating in your cup.";
              default:
                return "You keep modifying the Braun Aromaster, making it more and more powerful. At this point, you're not sure if you're drinking coffee or some kind of energy elixir. You feel like you could run a marathon just from one cup.";
            }
          },
          descriptionDependencies(key) {
            return [key.getCountKey()];
          },
          sprite: () => "unknown",
          tooltipContent: (state, key) => {
            const count = key.getCount(state);

            if (count.eq(0)) {
              return "Increases check in and cleaning rates by 10% for both you and your staff.";
            } else {
              return `Increases check in and cleaning rates by ${new Decimal(10).mul(count)}% for both you and your staff. Next purchase will increase it to ${new Decimal(10).mul(count.add(1))}%.`;
            }
          },
          tooltipContentDependencies(key) {
            return [key.getCountKey()];
          },
        }
      ),
      {
        ...geometricProgressionPurchase(new Decimal(100), new Decimal(2)),
        maxFormula: () => new Decimal(3),
      }
    ),
    {
      unlockCondition: defaultUnlockCondition(),
    }
  )
);

export const ParentsAppartmentUnits = [
  ParentsAppartment,
  GuestRoom,
  LivingRoom,
  YourRoom,
  HelpingHand,
  Jervasio,
  LonelyFlower,
  CaffeinatedJitters,
];

export { ParentsAppartment, GuestRoom, LivingRoom, HelpingHand };
