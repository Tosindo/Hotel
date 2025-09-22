import Decimal from "break_infinity.js";
import { createUnitBlueprint } from "../engine/createUnitBlueprint";
import { createValueNode } from "../engine/createCalculationNode";
import { UnitType, type UnitBlueprint } from "../engine/types";
import { DecimalOne, DecimalZero, NumberZero } from "../engine/constants";
import { NODE_PRIORITY } from "../priorities";

const StartingMoney = new Decimal(-13);

const Global = createUnitBlueprint("global", {
  type: UnitType.SYSTEM,
  hidden: true,

  getInitialState() {
    return {
      money: StartingMoney,
      occupiedRooms: DecimalZero,
      dirtyRooms: DecimalZero,
      checkoutCycleStartTime: Date.now(),
      cleaningCycleStartTime: null as number | null,
    };
  },

  getNodes(key) {
    return {
      checkoutCycleDuration: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "number",
        calculate: () => 30000,
      }),
      cleanRoomDuration: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "number",
        calculate: () => 8000,
      }),
      cleanRoomEfficiency: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => new Decimal(1),
      }),
      checkInEfficiency: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => new Decimal(1),
      }),
      totalRooms: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => DecimalZero,
      }),
      cleanRooms: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        dependencies: [
          key.getComputedValueKey("totalRooms"),
          key.getStateValueKey("dirtyRooms"),
          key.getStateValueKey("occupiedRooms"),
        ],
        returnType: "decimal",
        calculate: (state) => {
          const totalRooms =
            key.getComputedDecimal(state, "totalRooms") || DecimalZero;
          const globalState = key.getState(state);
          const dirtyRooms = globalState?.dirtyRooms || DecimalZero;
          const occupiedRooms = globalState?.occupiedRooms || DecimalZero;

          return totalRooms.sub(dirtyRooms).sub(occupiedRooms).max(0);
        },
      }),
      roomBasedPotentialIncome: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        calculate: () => DecimalZero,
      }),
      potentialIncome: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        returnType: "decimal",
        dependencies: [key.getComputedValueKey("roomBasedPotentialIncome")],
        calculate: (state) => {
          const roomBasedPotentialIncome = key.getComputedDecimal(
            state,
            "roomBasedPotentialIncome"
          );

          return DecimalZero.add(roomBasedPotentialIncome);
        },
      }),
      incomePerGuest: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        dependencies: [
          key.getComputedValueKey("potentialIncome"),
          key.getComputedValueKey("totalRooms"),
        ],
        returnType: "decimal",
        calculate: (state) => {
          const potentialIncome =
            key.getComputedDecimal(state, "potentialIncome") || DecimalZero;
          const totalRooms =
            key.getComputedDecimal(state, "totalRooms") || DecimalZero;

          if (totalRooms.eq(0)) {
            return DecimalZero;
          }

          return potentialIncome.div(totalRooms);
        },
      }),
      incomePerSecond: createValueNode({
        priority: NODE_PRIORITY.INITIAL,
        dependencies: [
          key.getComputedValueKey("incomePerGuest"),
          key.getStateValueKey("occupiedRooms"),
        ],
        returnType: "decimal",
        calculate(state) {
          const incomePerGuest =
            key.getComputedDecimal(state, "incomePerGuest") || DecimalZero;

          const occupiedRooms =
            key.getState(state)?.occupiedRooms || DecimalZero;

          return incomePerGuest.mul(occupiedRooms);
        },
      }),

      dailyProgress: createValueNode({
        priority: NODE_PRIORITY.LOW_PRIORITY,
        dependencies: [
          key.getStateValueKey("checkoutCycleStartTime"),
          key.getComputedValueKey("checkoutCycleDuration"),
        ],
        returnType: "number",
        calculate: (state) => {
          const globalState = key.getState(state);
          const checkoutCycleStartTime = globalState?.checkoutCycleStartTime;
          const checkoutCycleDuration = key.getComputedNumber(
            state,
            "checkoutCycleDuration"
          );

          if (!checkoutCycleStartTime || !checkoutCycleDuration) {
            return NumberZero;
          }

          const currentTime = Date.now();
          const elapsedTime = currentTime - checkoutCycleStartTime;
          return Math.min(elapsedTime / checkoutCycleDuration, 1);
        },
      }),

      cleaningProgress: createValueNode({
        priority: -NODE_PRIORITY.LOW_PRIORITY,
        dependencies: [
          key.getStateValueKey("cleaningCycleStartTime"),
          key.getComputedValueKey("cleanRoomDuration"),
        ],
        returnType: "number",
        calculate: (state) => {
          const globalState = key.getState(state);
          const cleaningCycleStartTime = globalState?.cleaningCycleStartTime;
          const cleanRoomDuration = key.getComputedNumber(
            state,
            "cleanRoomDuration"
          );

          if (!cleaningCycleStartTime || !cleanRoomDuration) {
            return NumberZero;
          }

          const currentTime = Date.now();
          const elapsedTime = currentTime - cleaningCycleStartTime;
          return Math.min(elapsedTime / cleanRoomDuration, 1);
        },
      }),
    };
  },

  getActions(key, getState, { updateState, updateCount }) {
    return {
      checkInGuest: () => {
        const gameState = getState();
        const cleanRooms =
          key.getComputedDecimal(gameState, "cleanRooms") ?? DecimalZero;
        const checkInEfficiency =
          key.getComputedDecimal(gameState, "checkInEfficiency") ??
          new Decimal(1);

        if (cleanRooms.lte(0)) {
          console.warn("No clean rooms available for check-in.");
          return;
        }

        const maxCheckIns = checkInEfficiency.round();
        let roomsToCheckIn = maxCheckIns;
        if (roomsToCheckIn.lte(0)) {
          console.warn("Check-in efficiency too low to check in any guests.");
          return;
        }

        if (roomsToCheckIn.gt(cleanRooms)) {
          roomsToCheckIn = cleanRooms;
        }

        updateState(key, (s) => ({
          ...s,
          occupiedRooms: s.occupiedRooms.add(roomsToCheckIn),
        }));
      },
      startCleaning: () => {
        const gameState = getState();
        const globalState = key.getState(gameState);
        if (!globalState) {
          console.warn("Global state is not initialized.");
          return;
        }

        if (globalState.cleaningCycleStartTime !== null) {
          console.warn("Cleaning cycle is already in progress.");
          return;
        }

        if (globalState.dirtyRooms.lte(0)) {
          console.warn("No dirty rooms to clean.");
          return;
        }

        updateState(key, (s) => ({
          ...s,
          cleaningCycleStartTime: Date.now(),
        }));
      },
      purchaseUnit: (
        unit: UnitBlueprint,
        quantity: 1 | 10 | 100 | 1000 | "max"
      ) => {
        const gameState = getState();
        const globalState = key.getState(gameState);
        if (!globalState) {
          console.warn("Global state is not initialized.");
          return;
        }

        const quantityProp =
          quantity === "max"
            ? "costMaxAffordable"
            : quantity === 1
              ? "cost"
              : `cost${quantity}`;

        const hasQuantityCost = unit.key.hasComputedValue(
          gameState,
          quantityProp
        );

        if (!hasQuantityCost) {
          console.warn(
            `Unit does not have cost node for quantity ${quantity}.`
          );
          return;
        }

        const cost = unit.key.getComputedDecimal(gameState, quantityProp);

        if (cost.gt(DecimalZero) && globalState.money.lt(cost)) {
          console.warn("Not enough money to purchase the unit.");
          return;
        }

        const quantityDecimal =
          quantity === "max"
            ? unit.key.getComputedDecimal(gameState, "maxAffordable")
            : new Decimal(quantity);

        const unitCount = unit.key.getCount(gameState);

        const max = unit.key.hasComputedValue(gameState, "max")
          ? unit.key.getComputedDecimal(gameState, "max")
          : null;
        if (max && max.lt(unitCount.add(quantityDecimal))) {
          console.warn("Cannot purchase more than the maximum allowed.");
          return;
        }

        updateState(key, (s) => ({
          ...s,
          money: s.money.sub(cost),
        }));
        updateCount(unit.key, unitCount.add(quantityDecimal));
      },
    };
  },

  tick(key, deltaTime, state, { updateState, updateComputedStale }) {
    const globalState = key.getState(state);
    const checkoutCycleDuration = key.getComputedNumber(
      state,
      "checkoutCycleDuration"
    );
    const incomePerSecond = key.getComputedDecimal(state, "incomePerSecond");
    if (!globalState || !checkoutCycleDuration || !incomePerSecond) return;

    updateComputedStale(key.getComputedValueKey("dailyProgress"));

    const currentTime = Date.now();
    const elapsedTime = currentTime - globalState.checkoutCycleStartTime;

    if (elapsedTime >= checkoutCycleDuration) {
      updateState(Global.key, (s) => ({
        ...s,
        dirtyRooms: s.dirtyRooms.add(s.occupiedRooms),
        occupiedRooms: DecimalZero,
        checkoutCycleStartTime: currentTime,
      }));
    }

    const incomeThisTick = incomePerSecond.mul(deltaTime);
    if (incomeThisTick.gt(0))
      updateState(Global.key, (s) => ({
        ...s,
        money: s.money.add(incomeThisTick),
      }));

    const cleaningCycleStartTime = globalState.cleaningCycleStartTime;
    const cleanRoomDuration = key.getComputedNumber(state, "cleanRoomDuration");
    const cleanRoomEfficiency =
      key.getComputedDecimal(state, "cleanRoomEfficiency") ?? new Decimal(1);

    if (cleaningCycleStartTime === null || !cleanRoomDuration) {
      return;
    }

    updateComputedStale(key.getComputedValueKey("cleaningProgress"));

    const dirtyRooms = globalState.dirtyRooms;
    if (dirtyRooms.lte(0)) {
      updateState(key, (s) => ({
        ...s,
        cleaningCycleStartTime: null,
      }));
      return;
    }

    const cleaningElapsedTime = currentTime - cleaningCycleStartTime;
    if (cleaningElapsedTime >= cleanRoomDuration) {
      const maxCleanableRooms = cleanRoomEfficiency.round();
      if (maxCleanableRooms.lte(0)) {
        console.warn("Clean room efficiency too low to clean any rooms.");
        return;
      }
      const dirtyRooms = globalState.dirtyRooms;
      let roomsToClean = maxCleanableRooms;
      if (roomsToClean.gt(dirtyRooms)) {
        roomsToClean = dirtyRooms;
      }

      updateState(key, (s) => ({
        ...s,
        dirtyRooms: s.dirtyRooms.sub(roomsToClean),
        cleaningCycleStartTime: null,
      }));
    }
  },

  initialize(k, _s, { updateCount }) {
    updateCount(k, DecimalOne);
  },
});

export { Global };
