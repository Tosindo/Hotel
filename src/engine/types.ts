import type Decimal from "break_infinity.js";
import type { UnitKey } from "./UnitKey";

export type ComputableValue = Decimal | number | boolean | string | null;

export type updateStateFunction = <
  K extends string,
  T extends Record<string, unknown>,
>(
  key: UnitKey<K, T>,
  updater: (prevState: T) => T
) => void;

export type updateCountFunction = (key: UnitKey, amount: Decimal) => void;

export type updateComputedStale = (key: ComputedDependencyKey) => void;

export interface EngineMutators {
  updateState: updateStateFunction;
  updateCount: updateCountFunction;
  updateComputedStale: updateComputedStale;
  dispatchAction: <
    Key extends string,
    TUnitActions extends UnitActionsObject,
    TActionKey extends keyof TUnitActions & string,
  >(
    unitKey: UnitKey<
      Key,
      Record<string, unknown>,
      UnitNodesObject,
      TUnitActions
    >,
    actionKey: TActionKey,
    ...args: Parameters<TUnitActions[TActionKey]>
  ) => void;
}

export enum UnitType {
  SYSTEM = "system",
  ROOM = "room",
  STAFF = "staff",
  SERVICE = "service",
  BUILDING = "building",
  UPGRADE = "upgrade",
}

export type UnitActionsObject = Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [actionName: string]: (...args: any[]) => void;
}>;

export type UnitNodesObject = Record<string, CalculationNode>;

export type UnitMetadata = Record<string, unknown>;

export interface UnitBlueprint<
  TKey extends string = string,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TNodesObject extends Record<string, CalculationNode> = UnitNodesObject,
  TActionsObject extends UnitActionsObject = UnitActionsObject,
> {
  key: UnitKey<TKey, TState, TNodesObject, TActionsObject>;
  type: UnitType;
  hidden?: boolean;
  metadata?: UnitMetadata;

  /**
   * Get computation nodes for this unit, only computed if the unit is owned (count > 0).
   */
  getNodes?: () => TNodesObject;

  /**
   * Get initial persistent state for this unit.
   */
  getInitialState?: () => TState;

  /**
   * Get global actions for this unit that can affect engine state.
   */
  getActions?: (
    getState: () => GameState,
    mutators: EngineMutators
  ) => TActionsObject;

  /**
   * Called on each engine tick IF the unit is owned (count > 0).
   */
  tick?: (
    deltaTime: number,
    state: GameState,
    mutators: EngineMutators
  ) => void;

  /**
   * Called once when the unit is first added to the engine, before the first tick.
   */
  initialize?: (state: GameState, mutators: EngineMutators) => void;
}

export type ComputedDependencyKey = `$${string}:${string}`;

export type StateDependencyKey = `#${string}:${string}`;

export type CountDependencyKey = `*${string}`;

export type DependencyKey =
  | ComputedDependencyKey
  | StateDependencyKey
  | CountDependencyKey;

export type ActionKey = `@${string}:${string}`;

interface CalculationNodeBase {
  name?: string;
  description?: string;
  dependencies?: DependencyKey[];
  priority?: number;
  alwaysCompute?: boolean;

  /**
   * Ignores modifiers when determining calculation order for this node.
   * E.g. if false, this node will wait for any modifier nodes that target dependencies of this node first, otherwise it will be based on priority solely.
   */
  ignoreModifiersOnModifiers?: boolean;
}

export type ReturnType<T> = T extends Decimal
  ? "decimal"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends string
        ? "string"
        : T extends null
          ? "null"
          : "mixed";

export type ComputableValueFromReturnType<R> = R extends "decimal"
  ? Decimal
  : R extends "number"
    ? number
    : R extends "boolean"
      ? boolean
      : R extends "string"
        ? string
        : R extends "null"
          ? null
          : ComputableValue;

export type ReturnTypes = ReturnType<ComputableValue>;

export interface ValueNode<T extends ComputableValue = ComputableValue>
  extends CalculationNodeBase {
  type: "value";

  returnType: ReturnType<T>;

  calculate: (state: GameState) => T;
}

export interface ModifierNode extends CalculationNodeBase {
  type: "modifier";

  targets: DependencyKey[];
  calculate: (state: GameState) => Record<string, ComputableValue>;
}

export type CalculationNode = ValueNode | ModifierNode;

export type BlueprintConfig<
  TKey extends string,
  TState extends Record<string, unknown>,
  TNodesObject extends UnitNodesObject,
  TActionsObject extends UnitActionsObject,
> = Omit<
  UnitBlueprint<TKey, TState, TNodesObject, TActionsObject>,
  "key" | "getNodes" | "tick" | "getInitialState" | "getActions" | "initialize"
> & {
  getInitialState?: () => TState;

  getNodes?: (
    key: UnitKey<TKey, TState, UnitNodesObject, UnitActionsObject>
  ) => TNodesObject;

  getActions?: (
    key: UnitKey<TKey, TState, TNodesObject, UnitActionsObject>,
    getState: () => GameState,
    mutators: EngineMutators
  ) => TActionsObject;

  tick?: (
    key: UnitKey<TKey, TState, TNodesObject, TActionsObject>,
    deltaTime: number,
    state: GameState,
    mutators: EngineMutators
  ) => void;

  initialize?: (
    key: UnitKey<TKey, TState, TNodesObject, TActionsObject>,
    state: GameState,
    mutators: EngineMutators
  ) => void;
};

export interface GameState {
  ownedUnits: Record<string, Decimal>;
  unitStates: Record<string, unknown>;

  computedValues: Record<string, ComputableValue>;
  actionValues: Record<string, unknown>;

  nodes: Map<string, CalculationNode>;
  blueprints: UnitBlueprint[];

  lastTickTime: number;
}

export interface SaveGameState
  extends Omit<
    GameState,
    "computedValues" | "actionValues" | "nodes" | "blueprints"
  > {
  gameVersion: string;
  lastSavedTime: number;
}
