import type {
  BlueprintConfig,
  DependencyKey,
  GameState,
  UnitActionsObject,
  UnitNodesObject,
} from "../engine/types";
import type { UnitKey } from "../engine/UnitKey";
import { createValueNode } from "../engine/createCalculationNode";
import { NODE_PRIORITY } from "../priorities";
import type { SpriteType } from "../utils/stringToSprite";

interface StaticDisplayableOptions {
  name: string;
  description: string;
  tooltipContent?: string;
  sprite: SpriteType;
}

export const staticDisplayable = (
  options: StaticDisplayableOptions
): DisplayableOptions => ({
  name: () => options.name,
  description: () => options.description,
  tooltipContent: () => options.tooltipContent || "",
  sprite: () => options.sprite,
});

export interface DisplayableOptions {
  name: (state: GameState, key: UnitKey) => string;
  nameDependencies?: (key: UnitKey) => DependencyKey[];
  description: (state: GameState, key: UnitKey) => string;
  descriptionDependencies?: (key: UnitKey) => DependencyKey[];
  tooltipContent?: (state: GameState, key: UnitKey) => string;
  tooltipContentDependencies?: (key: UnitKey) => DependencyKey[];
  sprite: (state: GameState, key: UnitKey) => string;
  spriteDependencies?: (key: UnitKey) => DependencyKey[];
}

export function displayable<
  TKey extends string,
  TState extends Record<string, unknown>,
  TNodes extends UnitNodesObject,
  TActions extends UnitActionsObject,
  Key extends UnitKey<TKey, TState, TNodes, TActions>,
>(
  config: BlueprintConfig<TKey, TState, TNodes, TActions>,
  options: DisplayableOptions
) {
  const displayableNodes = (key: Key) => ({
    name: createValueNode({
      alwaysCompute: true,
      priority: NODE_PRIORITY.INITIAL,
      dependencies: options.nameDependencies?.(key),
      returnType: "string",
      calculate: (state) => {
        return options.name(state, key);
      },
    }),
    description: createValueNode({
      alwaysCompute: true,
      priority: NODE_PRIORITY.INITIAL,
      dependencies: options.descriptionDependencies?.(key),
      returnType: "string",
      calculate: (state) => {
        return options.description(state, key);
      },
    }),
    tooltipContent: createValueNode({
      alwaysCompute: true,
      priority: NODE_PRIORITY.INITIAL,
      dependencies: options.tooltipContentDependencies?.(key),
      returnType: "string",
      calculate: (state) => {
        return options.tooltipContent ? options.tooltipContent(state, key) : "";
      },
    }),
    sprite: createValueNode({
      alwaysCompute: true,
      priority: NODE_PRIORITY.INITIAL,
      dependencies: options.spriteDependencies?.(key),
      returnType: "string",
      calculate: (state) => {
        return options.sprite(state, key);
      },
    }),
  });

  const originalGetNodes = config.getNodes;

  return {
    ...config,
    metadata: {
      ...config.metadata,
      displayable: true,
    },
    getNodes: (key: Key) => {
      const originalNodes = originalGetNodes ? originalGetNodes(key) : {};
      const newNodes = displayableNodes(key);
      return { ...newNodes, ...originalNodes } as TNodes &
        ReturnType<typeof displayableNodes>;
    },
  };
}
