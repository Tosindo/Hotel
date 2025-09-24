import type {
  BlueprintConfig,
  GameState,
  UnitActionsObject,
  UnitNodesObject,
} from "../engine/types";
import type { UnitKey } from "../engine/UnitKey";
import { createValueNode } from "../engine/createCalculationNode";
import { UnlockManager } from "../units/System/UnlockManager";
import { NODE_PRIORITY } from "../priorities";

export interface UnlockableOptions {
  unlockCondition: (state: GameState, key: UnitKey) => boolean;
}

export function unlockable<
  TKey extends string,
  TState extends Record<string, unknown>,
  TNodes extends UnitNodesObject,
  TActions extends UnitActionsObject,
  Key extends UnitKey<TKey, TState, TNodes, TActions>,
>(
  config: BlueprintConfig<TKey, TState, TNodes, TActions>,
  options: UnlockableOptions
) {
  const unlockableNodes = (key: Key) => ({
    isUnlocked: createValueNode({
      alwaysCompute: true,
      priority: NODE_PRIORITY.INITIAL,
      dependencies: [UnlockManager.key.getStateValueKey("unlockedUnits")],
      returnType: "boolean",
      calculate: (state) => {
        const unlockedUnits = UnlockManager.key.getState(state)?.unlockedUnits;
        if (!unlockedUnits) return false;
        return unlockedUnits.includes(key.toString());
      },
    }),
  });

  const originalGetNodes = config.getNodes;

  return {
    ...config,
    metadata: {
      ...config.metadata,
      unlockable: true,
      unlockCondition: options.unlockCondition,
    },
    getNodes: (key: Key) => {
      const originalNodes = originalGetNodes ? originalGetNodes(key) : {};
      const newNodes = unlockableNodes(key);
      return { ...newNodes, ...originalNodes } as TNodes &
        ReturnType<typeof unlockableNodes>;
    },
  };
}
