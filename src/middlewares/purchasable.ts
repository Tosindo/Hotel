import Decimal from "break_infinity.js";
import type {
  BlueprintConfig,
  DependencyKey,
  GameState,
  UnitActionsObject,
  UnitNodesObject,
} from "../engine/types";
import type { UnitKey } from "../engine/UnitKey";
import { createValueNode } from "../engine/createCalculationNode";
import { getMaxAffordable, getTotalCost } from "../utils/geometricProgression";
import { Global } from "../units/Global";
import { NODE_PRIORITY } from "../priorities";

export interface PurchasableOptions {
  baseCostFormula?: (state: GameState, key: UnitKey) => Decimal;
  baseCostDependencies?: (key: UnitKey) => DependencyKey[];

  growthRateFormula?: (state: GameState, key: UnitKey) => Decimal;
  growthRateDependencies?: (key: UnitKey) => DependencyKey[];

  costFormula: (state: GameState, key: UnitKey) => Decimal;
  costDependencies?: (key: UnitKey) => DependencyKey[];

  cost10Formula?: (state: GameState, key: UnitKey) => Decimal;
  cost10Dependencies?: (key: UnitKey) => DependencyKey[];

  cost100Formula?: (state: GameState, key: UnitKey) => Decimal;
  cost100Dependencies?: (key: UnitKey) => DependencyKey[];

  cost1000Formula?: (state: GameState, key: UnitKey) => Decimal;
  cost1000Dependencies?: (key: UnitKey) => DependencyKey[];

  maxAffordableFormula?: (state: GameState, key: UnitKey) => Decimal;
  maxAffordableDependencies?: (key: UnitKey) => DependencyKey[];

  costMaxAffordableFormula?: (state: GameState, key: UnitKey) => Decimal;
  costMaxAffordableDependencies?: (key: UnitKey) => DependencyKey[];

  maxFormula?: (state: GameState, key: UnitKey) => Decimal;
  maxDependencies?: (key: UnitKey) => DependencyKey[];

  singlePurchase?: boolean;
}

export const geometricProgressionPurchase = (
  baseCost: Decimal,
  growthRate: Decimal
): PurchasableOptions => ({
  baseCostFormula: () => baseCost,
  baseCostDependencies: () => [],

  growthRateFormula: () => growthRate,
  growthRateDependencies: () => [],

  costFormula: (state, key) => {
    const owned = key.getCount(state);
    const baseCost = key.getComputedDecimal(state, "baseCost");
    const growthRate = key.getComputedDecimal(state, "growthRate");

    return getTotalCost(baseCost, growthRate, owned, new Decimal(1));
  },
  costDependencies: (key) => [
    key.getCountKey(),
    key.getComputedValueKey("baseCost"),
    key.getComputedValueKey("growthRate"),
  ],

  cost10Formula: (state, key) => {
    const owned = key.getCount(state);
    const baseCost = key.getComputedDecimal(state, "baseCost");
    const growthRate = key.getComputedDecimal(state, "growthRate");
    return getTotalCost(baseCost, growthRate, owned, new Decimal(10));
  },
  cost10Dependencies: (key) => [
    key.getCountKey(),
    key.getComputedValueKey("baseCost"),
    key.getComputedValueKey("growthRate"),
  ],

  cost100Formula: (state, key) => {
    const owned = key.getCount(state);
    const baseCost = key.getComputedDecimal(state, "baseCost");
    const growthRate = key.getComputedDecimal(state, "growthRate");
    return getTotalCost(baseCost, growthRate, owned, new Decimal(100));
  },
  cost100Dependencies: (key) => [
    key.getCountKey(),
    key.getComputedValueKey("baseCost"),
    key.getComputedValueKey("growthRate"),
  ],

  cost1000Formula: (state, key) => {
    const owned = key.getCount(state);
    const baseCost = key.getComputedDecimal(state, "baseCost");
    const growthRate = key.getComputedDecimal(state, "growthRate");
    return getTotalCost(baseCost, growthRate, owned, new Decimal(1000));
  },
  cost1000Dependencies: (key) => [
    key.getCountKey(),
    key.getComputedValueKey("baseCost"),
    key.getComputedValueKey("growthRate"),
  ],

  maxAffordableFormula: (state, key) => {
    const owned = key.getCount(state);
    const money = Global.key.getState(state)?.money ?? new Decimal(0);
    const baseCost = key.getComputedDecimal(state, "baseCost");
    const growthRate = key.getComputedDecimal(state, "growthRate");
    return getMaxAffordable(baseCost, growthRate, owned, money);
  },
  maxAffordableDependencies: (key) => [
    key.getCountKey(),
    Global.key.getStateValueKey("money"),
    key.getComputedValueKey("baseCost"),
    key.getComputedValueKey("growthRate"),
  ],

  costMaxAffordableFormula(state, key) {
    const owned = key.getCount(state);
    const maxAffordable = key.getComputedDecimal(state, "maxAffordable");
    const baseCost = key.getComputedDecimal(state, "baseCost");
    const growthRate = key.getComputedDecimal(state, "growthRate");
    return getTotalCost(baseCost, growthRate, owned, maxAffordable);
  },
  costMaxAffordableDependencies: (key) => [
    key.getCountKey(),
    key.getComputedValueKey("maxAffordable"),
    key.getComputedValueKey("baseCost"),
    key.getComputedValueKey("growthRate"),
  ],
});

export function purchasable<
  TKey extends string,
  TState extends Record<string, unknown>,
  TNodes extends UnitNodesObject,
  TActions extends UnitActionsObject,
  Key extends UnitKey<TKey, TState, TNodes, TActions>,
>(
  config: BlueprintConfig<TKey, TState, TNodes, TActions>,
  options: PurchasableOptions
) {
  const purchasableNodes = (key: Key) => ({
    ...(options.baseCostFormula && {
      baseCost: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.baseCostDependencies
          ? options.baseCostDependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.baseCostFormula!(state, key),
      }),
    }),

    ...(options.growthRateFormula && {
      growthRate: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.growthRateDependencies
          ? options.growthRateDependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.growthRateFormula!(state, key),
      }),
    }),

    cost: createValueNode({
      alwaysCompute: true,
      priority: NODE_PRIORITY.INITIAL,
      dependencies: options.costDependencies
        ? options.costDependencies(key)
        : [],
      returnType: "decimal",
      calculate: (state) => options.costFormula(state, key),
    }),

    ...(options.cost10Formula && {
      cost10: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.cost10Dependencies
          ? options.cost10Dependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.cost10Formula!(state, key),
      }),
    }),

    ...(options.cost100Formula && {
      cost100: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.cost100Dependencies
          ? options.cost100Dependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.cost100Formula!(state, key),
      }),
    }),

    ...(options.cost1000Formula && {
      cost1000: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.cost1000Dependencies
          ? options.cost1000Dependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.cost1000Formula!(state, key),
      }),
    }),

    ...(options.maxAffordableFormula && {
      maxAffordable: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.maxAffordableDependencies
          ? options.maxAffordableDependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.maxAffordableFormula!(state, key),
      }),
    }),

    ...(options.costMaxAffordableFormula && {
      costMaxAffordable: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.costMaxAffordableDependencies
          ? options.costMaxAffordableDependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.costMaxAffordableFormula!(state, key),
      }),
    }),

    ...(options.maxFormula && {
      max: createValueNode({
        alwaysCompute: true,
        priority: NODE_PRIORITY.INITIAL,
        dependencies: options.maxDependencies
          ? options.maxDependencies(key)
          : [],
        returnType: "decimal",
        calculate: (state) => options.maxFormula!(state, key),
      }),
    }),
  });

  const originalGetNodes = config.getNodes;

  return {
    ...config,
    metadata: {
      ...config.metadata,
      purchasable: true,
      singlePurchase: options.singlePurchase === true,
    },
    getNodes: (key: Key) => {
      const originalNodes = originalGetNodes ? originalGetNodes(key) : {};
      const newNodes = purchasableNodes(key);
      return { ...newNodes, ...originalNodes } as TNodes &
        ReturnType<typeof purchasableNodes>;
    },
  };
}
