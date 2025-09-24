import Decimal from "break_infinity.js";
import { DecimalOne, DecimalZero } from "../../engine/constants";
import { createValueNode } from "../../engine/createCalculationNode";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";
import { displayable, staticDisplayable } from "../../middlewares/displayable";
import { purchasable } from "../../middlewares/purchasable";
import { unlockable } from "../../middlewares/unlockable";
import { NODE_PRIORITY } from "../../priorities";
import { spriteAnimationConfig } from "../../utils/stringToSprite";
import { GuestRoom } from "../Buildings/ParentsAppartment";
import { bool, integer } from "random-js";
import { Global } from "../System/Global";
import { Sound } from "../System/Sound";

const HandOutFlyers = createUnitBlueprint("flyers", {
  type: UnitType.SYSTEM,

  getInitialState() {
    return {
      timeStarted: null as number | null,
      isCreepy: false as boolean,
      stage: "none" as
        | "none"
        | "walking"
        | "handingOut"
        | "success"
        | "decision"
        | "failure",
      pendingGuests: DecimalZero,
      repeat: DecimalZero,
    };
  },

  getNodes(key) {
    return {
      creepyChance: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => new Decimal(10), // 10% chance to be creepy
      }),

      animationFinishDelay: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "number",
        calculate: () => 1500, // delay after animation ends
      }),

      baseSuccessChance: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => new Decimal(90),
      }),

      repeatPenalty: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        dependencies: [key.getStateValueKey("repeat")],
        calculate: (state) => {
          const unitState = key.getState(state);
          if (!unitState) return DecimalZero;

          const repeat = unitState.repeat;

          const penalty = new Decimal(1).minus(new Decimal(0.85).pow(repeat));
          return penalty.times(100); // Convert to percentage
        },
      }),

      minimumSuccessChance: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => new Decimal(5), // Minimum 5% chance
      }),

      successChance: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        dependencies: [
          key.getStateValueKey("repeat"),
          key.getComputedValueKey("baseSuccessChance"),
          key.getComputedValueKey("repeatPenalty"),
          key.getComputedValueKey("minimumSuccessChance"),
        ],
        calculate(state) {
          const unitState = key.getState(state);
          if (!unitState) return DecimalZero;

          const baseChance = key.getComputedDecimal(state, "baseSuccessChance");
          const repeatPenalty = key.getComputedDecimal(state, "repeatPenalty");
          const minChance = key.getComputedDecimal(
            state,
            "minimumSuccessChance"
          );

          const finalChance = baseChance.minus(repeatPenalty);
          return Decimal.max(finalChance, minChance);
        },
      }),

      successMinGuests: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => new Decimal(1), // Always get at least 1 guest on success
      }),

      successMaxGuests: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => new Decimal(1), // Up to 1 guest on success (increased with upgrades later)
      }),
    };
  },

  getActions(key, getState, mutators) {
    return {
      startHandingOutFlyers: () => {
        const state = getState();
        const unitState = key.getState(state);
        if (!unitState || unitState.stage !== "none") return;

        mutators.updateState(key, (s) => ({
          ...s,
          stage: "walking" as const,
          timeStarted: Date.now(),
          isCreepy: false,
        }));
      },
      continueHandingOutFlyers: () => {
        const state = getState();
        const unitState = key.getState(state);
        if (!unitState || unitState.stage !== "decision") return;

        mutators.updateState(key, (s) => ({
          ...s,
          stage: "walking" as const,
          timeStarted: Date.now(),
          isCreepy: false,
        }));
      },
      collectPendingGuests: () => {
        const state = getState();
        const unitState = key.getState(state);
        if (
          !unitState ||
          unitState.pendingGuests.lte(0) ||
          unitState.stage !== "decision"
        )
          return;

        const guestsToAdd = unitState.pendingGuests;

        mutators.updateState(key, (s) => ({
          ...s,
          stage: "none" as const,
          timeStarted: null,
          pendingGuests: DecimalZero,
          repeat: DecimalZero,
          isCreepy: false,
        }));

        mutators.updateState(Global.key, (s) => ({
          ...s,
          availableGuests: s.availableGuests.add(guestsToAdd),
        }));
      },
    };
  },

  tick(key, _, state, mutators) {
    const unitState = key.getState(state);
    if (!unitState || unitState.stage === "none") return;

    if (!unitState.timeStarted) {
      mutators.updateState(key, (s) => ({
        ...s,
        stage: "none" as const,
        timeStarted: null,
        pendingGuests: DecimalZero,
        repeat: DecimalZero,
        isCreepy: false,
      }));
      return;
    }

    const animationFinishDelay = key.getComputedNumber(
      state,
      "animationFinishDelay"
    );

    switch (unitState.stage) {
      case "walking": {
        const duration =
          spriteAnimationConfig.distributeFlyersWalk.duration +
          animationFinishDelay;
        const timeElapsed = Date.now() - unitState.timeStarted;

        if (timeElapsed >= duration) {
          mutators.updateState(key, (s) => ({
            ...s,
            stage: "handingOut" as const,
            timeStarted: Date.now(),
          }));
          mutators.dispatchAction(Sound.key, "playSound", "paper");
        }
        break;
      }
      case "handingOut": {
        const duration =
          spriteAnimationConfig.distributeFlyersGive.duration +
          animationFinishDelay;
        const timeElapsed = Date.now() - unitState.timeStarted;

        if (timeElapsed >= duration) {
          const creepyChance = key.getComputedDecimal(state, "creepyChance");
          const isCreepyDistribution = bool(creepyChance.div(100).toNumber());
          const isCreepy = isCreepyDistribution(state.randomEngine);

          const successChange = key
            .getComputedDecimal(state, "successChance")
            .div(100);
          const booleanDistribution = bool(successChange.toNumber());
          const isSuccess = booleanDistribution(state.randomEngine);

          if (isSuccess) {
            const minGuests = key.getComputedDecimal(state, "successMinGuests");
            const maxGuests = key.getComputedDecimal(state, "successMaxGuests");
            const integerDistribution = integer(
              minGuests.toNumber(),
              maxGuests.toNumber()
            );
            const guestsToAdd = integerDistribution(state.randomEngine);

            mutators.updateState(key, (s) => ({
              ...s,
              stage: "success" as const,
              timeStarted: Date.now(),
              pendingGuests: s.pendingGuests.add(guestsToAdd),
              repeat: s.repeat.add(1),
              isCreepy: isCreepy,
            }));

            mutators.dispatchAction(
              Sound.key,
              "playSound",
              isCreepy ? "success_distorted" : "success"
            );
          } else {
            const newRepeat = unitState.repeat.add(DecimalOne);
            mutators.updateState(key, (s) => ({
              ...s,
              stage: "failure" as const,
              timeStarted: Date.now(),
              repeat: newRepeat,
              isCreepy: isCreepy,
            }));
            mutators.dispatchAction(
              Sound.key,
              "playSound",
              isCreepy ? "failure_distorted" : "failure"
            );
          }
        }
        break;
      }
      case "success": {
        const isCreepy = unitState.isCreepy;
        const duration = (isCreepy ? 3000 : 2000) + animationFinishDelay;
        const timeElapsed = Date.now() - unitState.timeStarted;
        if (timeElapsed >= duration) {
          mutators.updateState(key, (s) => ({
            ...s,
            stage: "decision" as const,
            timeStarted: Date.now(),
            isCreepy: false,
          }));
        }
        break;
      }
      case "failure": {
        const isCreepy = unitState.isCreepy;
        const duration = (isCreepy ? 3000 : 2000) + animationFinishDelay;
        const timeElapsed = Date.now() - unitState.timeStarted;
        if (timeElapsed >= duration) {
          mutators.updateState(key, (s) => ({
            ...s,
            stage: "none" as const,
            timeStarted: null,
            pendingGuests: DecimalZero,
            repeat: DecimalZero,
            isCreepy: false,
          }));
        }
        break;
      }
    }
  },

  initialize(k, _s, { updateCount }) {
    updateCount(k, DecimalOne);
  },
});

const PenAndPaper = createUnitBlueprint(
  "penAndPaper",
  unlockable(
    purchasable(
      displayable(
        {
          type: UnitType.SERVICE,

          getNodes() {
            return {};
          },
        },
        staticDisplayable({
          name: "Pen and Paper",
          description:
            "You got a room, but no guests yet. Let's make some flyers and advertise!",
          sprite: "penAndPaper",
        })
      ),
      {
        costFormula: () => DecimalZero,
        maxFormula: () => DecimalOne,
        singlePurchase: true,
        customPurchaseText: "Grab a pen",
      }
    ),
    {
      unlockCondition(state) {
        return GuestRoom.key.getCount(state).gte(DecimalOne);
      },
    }
  )
);

export { PenAndPaper, HandOutFlyers };
