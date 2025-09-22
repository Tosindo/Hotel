import Decimal from "break_infinity.js";
import type {
  BlueprintConfig,
  DependencyKey,
  GameState,
  UnitActionsObject,
  UnitNodesObject,
} from "../engine/types";
import type { UnitKey } from "../engine/UnitKey";
import {
  createModifierNode,
  createValueNode,
} from "../engine/createCalculationNode";
import { Global } from "../units/Global";
import { DecimalZero } from "../engine/constants";
import { NODE_PRIORITY } from "../priorities";

export interface RoomifyOptions {
  individualValueFormula: (state: GameState, key: UnitKey) => Decimal;
  individualValueDependencies?: (key: UnitKey) => DependencyKey[];

  potentialIncomeTarget?: string;
  potentialIncomeKey?: UnitKey;
}

export function roomify<
  TKey extends string,
  TState extends Record<string, unknown>,
  TNodes extends UnitNodesObject,
  TActions extends UnitActionsObject,
  Key extends UnitKey<TKey, TState, TNodes, TActions>,
>(
  config: BlueprintConfig<TKey, TState, TNodes, TActions>,
  options: RoomifyOptions
) {
  const {
    potentialIncomeKey = Global.key as unknown as UnitKey,
    potentialIncomeTarget = "roomBasedPotentialIncome",
  } = options;

  const roomNodes = (key: Key) => ({
    individualValue: createValueNode({
      priority: NODE_PRIORITY.INITIAL,
      dependencies: options.individualValueDependencies?.(key),
      returnType: "decimal",
      calculate: (state) => options.individualValueFormula(state, key),
    }),
    value: createValueNode({
      priority: NODE_PRIORITY.INITIAL,
      dependencies: [
        key.getCountKey(),
        key.getComputedValueKey("individualValue"),
      ],
      returnType: "decimal",
      calculate: (state) => {
        const owned = key.getCount(state);
        const individualValue = key.getComputedDecimal(
          state,
          "individualValue"
        );

        return individualValue.mul(owned);
      },
    }),
    valueOnIncome: createModifierNode({
      priority: NODE_PRIORITY.ROOM_MODIFY,
      dependencies: [
        potentialIncomeKey.getComputedValueKey(potentialIncomeTarget),
        key.getComputedValueKey("value"),
      ],
      targets: [potentialIncomeKey.getComputedValueKey(potentialIncomeTarget)],
      calculate: (state) => {
        const potentialIncome =
          potentialIncomeKey.getComputedDecimal(state, potentialIncomeTarget) ||
          DecimalZero;
        const value = key.getComputedDecimal(state, "value") || DecimalZero;

        console.log(
          `Adding room value ${value.toString()} to ${potentialIncomeTarget} (was ${potentialIncome.toString()})`
        );

        return {
          [potentialIncomeKey.getComputedValueKey(potentialIncomeTarget)]:
            potentialIncome.add(value),
        };
      },
    }),
    selfOnTotalRooms: createModifierNode({
      priority: NODE_PRIORITY.ROOM_MODIFY,
      dependencies: [
        Global.key.getComputedValueKey("totalRooms"),
        key.getCountKey(),
      ],
      targets: [Global.key.getComputedValueKey("totalRooms")],
      calculate: (state) => {
        const owned = key.getCount(state);
        const totalRooms =
          Global.key.getComputedDecimal(state, "totalRooms") || DecimalZero;

        return {
          [Global.key.getComputedValueKey("totalRooms")]: totalRooms.add(owned),
        };
      },
    }),
  });

  const originalGetNodes = config.getNodes;

  return {
    ...config,
    getNodes: (key: Key) => {
      const originalNodes = originalGetNodes ? originalGetNodes(key) : {};
      const newNodes = roomNodes(key);
      return { ...newNodes, ...originalNodes } as TNodes &
        ReturnType<typeof roomNodes>;
    },
  };
}
