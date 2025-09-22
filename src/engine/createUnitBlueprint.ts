import type {
  BlueprintConfig,
  UnitActionsObject,
  UnitBlueprint,
  UnitNodesObject,
} from "./types";
import { UnitKey } from "./UnitKey";

export function createUnitBlueprint<
  const TKey extends string,
  const TState extends Record<string, unknown>,
  const TNodesObject extends UnitNodesObject,
  const TActionsObject extends UnitActionsObject,
>(
  key: TKey,
  config: BlueprintConfig<TKey, TState, TNodesObject, TActionsObject>
) {
  const unitKey = new UnitKey<TKey, TState, TNodesObject, TActionsObject>(key);

  const blueprint: UnitBlueprint<TKey, TState, TNodesObject, TActionsObject> = {
    key: unitKey,
    ...config,

    getNodes: config.getNodes ? () => config.getNodes!(unitKey) : undefined,

    getInitialState: config.getInitialState,

    getActions: config.getActions
      ? (getState, mutators) => config.getActions!(unitKey, getState, mutators)
      : undefined,

    tick: config.tick
      ? (deltaTime, state, mutators) =>
          config.tick!(unitKey, deltaTime, state, mutators)
      : undefined,

    initialize: config.initialize
      ? (state, mutators) => config.initialize!(unitKey, state, mutators)
      : undefined,
  };

  return blueprint;
}
