import Decimal from "break_infinity.js";
import type {
  CalculationNode,
  ComputableValue,
  ComputedDependencyKey,
  DependencyKey,
  GameState,
  SaveGameState,
  UnitActionsObject,
  UnitBlueprint,
  UnitNodesObject,
} from "./types";
import type { UnitKey } from "./UnitKey";
import { GAME_VERSION } from "../config";
import { DecimalZero } from "./constants";
import { validateNodeType } from "./validateNodeType";
import { getDefaultNodeValue } from "./getDefaultNodeValue";

class Engine {
  blueprints: UnitBlueprint[];
  blueprintMap: Map<string, UnitBlueprint> = new Map();
  blueprintsWithTick: string[] = [];

  private subscriptions: Map<DependencyKey, Set<() => void>> = new Map();

  ownedUnits: Record<string, Decimal>;

  computedValues: Record<string, ComputableValue>;
  unitStates: Record<string, unknown>;
  actionValues: Record<string, unknown>;

  private dependencyGraph: Map<DependencyKey, Set<DependencyKey>> = new Map();
  private modificationGraph: Map<DependencyKey, Set<DependencyKey>> = new Map();
  private nodes: Map<DependencyKey, CalculationNode> = new Map();
  private nodeToBlueprint: Map<DependencyKey, UnitBlueprint> = new Map();
  private blueprintToNodes: Map<UnitBlueprint, Set<DependencyKey>> = new Map();
  private calculationOrder: DependencyKey[] = []; // This will hold the sorted order

  lastTickTime: number;

  constructor(blueprints: UnitBlueprint[]) {
    this.blueprints = blueprints;

    this.ownedUnits = {};
    this.unitStates = {};
    this.actionValues = {};

    this.computedValues = {};

    this.lastTickTime = Date.now();

    this.initializeAndSortGraph();
    console.log(
      "Calculation order:",
      this.calculationOrder,
      "dependencyGraph:",
      this.dependencyGraph,
      "modificationGraph:",
      this.modificationGraph
    );
    this.computeAllValues();
  }

  public getBlueprints(): UnitBlueprint[] {
    return this.blueprints;
  }

  private getGameState(): GameState {
    return {
      ownedUnits: this.ownedUnits,
      unitStates: this.unitStates,
      computedValues: this.computedValues,
      lastTickTime: this.lastTickTime,
      actionValues: this.actionValues,
      nodes: this.nodes,
      blueprints: this.blueprints,
    };
  }

  private updateState<K extends string, T extends Record<string, unknown>>(
    key: UnitKey<K, T>,
    updater: (prevState: T) => T
  ) {
    const prevState = key.getState(this.getGameState());
    if (!prevState) {
      console.warn(`No state found for unit key: ${key}`);
      return;
    }

    const newState = updater(prevState);

    this.unitStates[key.toString()] = newState;

    const changedDeps: DependencyKey[] = [];
    const prevKeys = Object.keys(prevState);
    const newKeys = Object.keys(newState);
    const allKeys = new Set([...prevKeys, ...newKeys]);

    for (const prop of allKeys) {
      const prevVal = prevState[prop];
      const newVal = newState[prop];

      let changed = false;

      if (prevVal && prevVal instanceof Decimal && newVal instanceof Decimal) {
        if (!prevVal.eq(newVal)) changed = true;
      } else {
        changed = prevVal !== newVal;
      }

      if (changed) {
        changedDeps.push(key.getStateValueKey(prop as keyof T));
      }
    }

    if (changedDeps.length === 0) return;

    this.notify(new Set(changedDeps));

    const affected = this.gatherAffectedComputedNodes(changedDeps);
    if (affected.size === 0) return;

    const minIndex = this.findMinCalculationIndex(affected);
    if (minIndex !== -1) this.recomputeFromIndex(minIndex, affected);
  }

  private updateCount(key: UnitKey, count: Decimal) {
    const prevCount =
      (this.ownedUnits[key.toString()] as Decimal) || DecimalZero;

    this.ownedUnits[key.toString()] = count;

    const changedKey = key.getCountKey();
    this.notify(new Set([changedKey]));

    const becameActive =
      prevCount instanceof Decimal
        ? prevCount.eq(0) && count.gt(0)
        : count.gt(0);

    const affected = this.gatherAffectedComputedNodes(
      [changedKey],
      false,
      becameActive ? key : undefined
    );
    if (affected.size === 0) return;

    const minIndex = this.findMinCalculationIndex(affected);
    if (minIndex !== -1) this.recomputeFromIndex(minIndex, affected);
  }

  private updateComputedStale(key: ComputedDependencyKey) {
    const affected = this.gatherAffectedComputedNodes([key], true);
    if (affected.size === 0) return;

    const minIndex = this.findMinCalculationIndex(affected);
    if (minIndex !== -1) this.recomputeFromIndex(minIndex, affected);
  }

  private isComputable(key: DependencyKey): boolean {
    const node = this.nodes.get(key);
    if (!node) return false;

    if (node.alwaysCompute) return true;

    const blueprint = this.nodeToBlueprint.get(key);
    if (!blueprint) return false;

    const owned = this.getUnitCount(blueprint.key);
    return owned.gt(0);
  }

  private gatherAffectedComputedNodes(
    startKeys: DependencyKey[],
    includeSelf = false,
    activatingUnit?: UnitKey
  ): Set<DependencyKey> {
    const affected = new Set<DependencyKey>(includeSelf ? startKeys : []);
    const queue: DependencyKey[] = [...startKeys];

    if (activatingUnit) {
      const blueprint = this.blueprintMap.get(activatingUnit.toString());
      if (blueprint) {
        const nodes = this.blueprintToNodes.get(blueprint);
        if (nodes) {
          for (const node of nodes) {
            if (!affected.has(node) && this.isComputable(node)) {
              affected.add(node);
              queue.push(node);
            }
          }
        }
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const dependents = this.dependencyGraph.get(current);
      if (dependents) {
        for (const dep of dependents) {
          if (affected.has(dep) || !this.isComputable(dep)) continue;
          affected.add(dep);
          queue.push(dep);
        }
      }

      const modifiers = this.modificationGraph.get(current);
      if (modifiers) {
        for (const mod of modifiers) {
          if (affected.has(mod) || !this.isComputable(mod)) continue;
          affected.add(mod);
          queue.push(mod);
        }
      }
    }

    return affected;
  }

  private findMinCalculationIndex(affected: Set<DependencyKey>): number {
    let minIndex = Infinity;
    for (const key of affected) {
      const idx = this.calculationOrder.indexOf(key);
      if (idx !== -1 && idx < minIndex) minIndex = idx;
    }
    return minIndex === Infinity ? -1 : minIndex;
  }

  private notify(changedKeys: Set<DependencyKey>) {
    const callbacksToRun = new Set<() => void>();
    for (const key of changedKeys) {
      const callbacks = this.subscriptions.get(key);
      if (callbacks) {
        callbacks.forEach((cb) => callbacksToRun.add(cb));
      }
    }
    // Run each unique callback only once
    callbacksToRun.forEach((cb) => cb());
  }

  private initializeAndSortGraph() {
    const inDegrees: Map<DependencyKey, number> = new Map();

    // 1st pass: initialize count and state graph keys, and setup actions
    for (const blueprint of this.blueprints) {
      this.blueprintMap.set(blueprint.key.toString(), blueprint);
      if (blueprint.tick) {
        this.blueprintsWithTick.push(blueprint.key.toString());
      }

      const countKey = blueprint.key.getCountKey();
      if (!this.dependencyGraph.has(countKey)) {
        this.dependencyGraph.set(countKey, new Set());
      }

      if (blueprint.getInitialState) {
        const initial = blueprint.getInitialState();
        for (const prop of Object.keys(initial)) {
          const stateKey = blueprint.key.getStateValueKey(prop);
          if (!this.dependencyGraph.has(stateKey)) {
            this.dependencyGraph.set(stateKey, new Set());
          }
        }

        this.unitStates[blueprint.key.toString()] = initial;
      }

      if (blueprint.getActions) {
        const actions = blueprint.getActions(() => this.getGameState(), {
          updateState: (k, updater) => this.updateState(k, updater),
          updateCount: (k, count) => this.updateCount(k, count),
          updateComputedStale: (k) => this.updateComputedStale(k),
          dispatchAction: (k, actionName, ...args) =>
            this.dispatchAction(k, actionName, ...args),
        });

        // Actions are not dependable or depended on, so we just register them
        for (const actionKey of Object.keys(actions)) {
          const fullActionKey = blueprint.key.getActionKey(actionKey);
          this.actionValues[fullActionKey] = actions[actionKey];
        }
      }
    }

    // 2nd pass: register computation nodes and build their graph
    for (const blueprint of this.blueprints) {
      if (blueprint.getNodes) {
        const nodes = blueprint.getNodes();
        for (const [nodeKey, node] of Object.entries(nodes)) {
          const fullKey = blueprint.key.getComputedValueKey(nodeKey);
          this.nodes.set(fullKey, node);
          this.nodeToBlueprint.set(fullKey, blueprint);

          if (!this.blueprintToNodes.has(blueprint)) {
            this.blueprintToNodes.set(blueprint, new Set());
          }
          this.blueprintToNodes.get(blueprint)!.add(fullKey);

          // Initialize structures for this node
          const computedNodeDependencies =
            node.dependencies?.filter((dep) => dep.startsWith("$")) || [];
          inDegrees.set(fullKey, computedNodeDependencies.length);
          if (!this.dependencyGraph.has(fullKey)) {
            this.dependencyGraph.set(fullKey, new Set());
          }

          for (const dep of node.dependencies || []) {
            if (!this.dependencyGraph.has(dep)) {
              this.dependencyGraph.set(dep, new Set());
            }
            this.dependencyGraph.get(dep)!.add(fullKey);
          }

          if (node.type === "modifier" && node.targets.length > 0) {
            if (!this.modificationGraph.has(fullKey)) {
              this.modificationGraph.set(fullKey, new Set());
            }

            for (const target of node.targets) {
              this.modificationGraph.get(fullKey)!.add(target);
            }
          }
        }
      }
    }

    // Extra pass: enforce ordering so that value nodes (unless they opt-out via
    // ignoreModifiers) are computed after any modifiers that modify their
    // dependencies.
    for (const [modifierKey, targets] of this.modificationGraph.entries()) {
      for (const target of targets) {
        for (const [nodeKey, node] of this.nodes.entries()) {
          if (node.ignoreModifiersOnModifiers) continue;

          // For value nodes, consider all dependencies
          // For modifier nodes we want to avoid circularities, so only consider their dependencies that are not also their targets.
          const deps =
            node.type === "value"
              ? node.dependencies || []
              : node.dependencies?.filter((d) => !node.targets.includes(d)) ||
                [];
          if (deps.includes(target)) {
            if (!this.dependencyGraph.has(modifierKey)) {
              this.dependencyGraph.set(modifierKey, new Set());
            }
            const dependents = this.dependencyGraph.get(modifierKey)!;
            if (!dependents.has(nodeKey)) {
              dependents.add(nodeKey);

              inDegrees.set(nodeKey, (inDegrees.get(nodeKey) || 0) + 1);
            }
          }
        }
      }
    }

    const queue: DependencyKey[] = [];
    for (const [key, degree] of inDegrees.entries()) {
      if (degree === 0) {
        queue.push(key);
      }
    }

    queue.sort((a, b) => {
      const priorityA = this.nodes.get(a)?.priority || 0;
      const priorityB = this.nodes.get(b)?.priority || 0;
      return priorityB - priorityA;
    });

    while (queue.length > 0) {
      const currentKey = queue.shift()!;
      this.calculationOrder.push(currentKey);

      const dependents = this.dependencyGraph.get(currentKey) || new Set();

      for (const dependentKey of dependents) {
        const newDegree = (inDegrees.get(dependentKey) || 0) - 1;
        inDegrees.set(dependentKey, newDegree);

        if (newDegree === 0) {
          queue.push(dependentKey);
          queue.sort((a, b) => {
            const priorityA = this.nodes.get(a)?.priority || 0;
            const priorityB = this.nodes.get(b)?.priority || 0;
            return priorityB - priorityA;
          });
        }
      }
    }

    if (this.calculationOrder.length !== this.nodes.size) {
      const calculated = new Set(this.calculationOrder);
      const missing = [...this.nodes.keys()].filter((k) => !calculated.has(k));
      throw new Error(
        `Circular dependency detected. Could not calculate the following nodes: ${missing.join(", ")}`
      );
    }

    this.notify(new Set(Object.keys(this.dependencyGraph) as DependencyKey[]));

    /** Run initialization for each blueprint */
    for (const blueprint of this.blueprints) {
      if (blueprint.initialize) {
        blueprint.initialize(this.getGameState(), {
          updateState: (k, updater) => this.updateState(k, updater),
          updateCount: (k, count) => this.updateCount(k, count),
          updateComputedStale: (k) => this.updateComputedStale(k),
          dispatchAction: (k, actionName, ...args) =>
            this.dispatchAction(k, actionName, ...args),
        });
      }
    }
  }

  private computeNode(nodeKey: DependencyKey): Set<DependencyKey> {
    const affected = new Set<DependencyKey>();

    if (!this.isComputable(nodeKey)) return affected;

    const node = this.nodes.get(nodeKey);
    if (!node) return affected;

    const previousValue = this.computedValues[nodeKey];

    const gameState = this.getGameState();
    let result = node.calculate(gameState);

    if (node.type === "value") {
      const computableValue = result as ComputableValue;

      const isValid = validateNodeType(node, computableValue);
      if (!isValid) result = getDefaultNodeValue(node);

      this.computedValues[nodeKey] = result as ComputableValue;
    } else if (node.type === "modifier") {
      const modifiers = result as Record<string, Decimal>;

      for (const [targetKey, modValue] of Object.entries(modifiers)) {
        const targetNode = this.nodes.get(targetKey as DependencyKey);
        if (!targetNode || targetNode.type !== "value") continue;

        const isValid = validateNodeType(targetNode, modValue);
        if (!isValid) continue;

        const existingValue = this.computedValues[targetKey];

        if (existingValue === undefined) {
          this.computedValues[targetKey] = modValue;
          affected.add(targetKey as DependencyKey);
        } else if (
          modValue instanceof Decimal &&
          existingValue instanceof Decimal
        ) {
          if (modValue.eq(existingValue)) continue;
          this.computedValues[targetKey] = modValue;
          affected.add(targetKey as DependencyKey);
        } else {
          if (modValue === existingValue) continue;
          this.computedValues[targetKey] = modValue;
          affected.add(targetKey as DependencyKey);
        }
      }
    }

    const newValue = this.computedValues[nodeKey];
    if (
      (previousValue instanceof Decimal &&
        newValue instanceof Decimal &&
        !previousValue.eq(newValue)) ||
      previousValue !== newValue
    ) {
      affected.add(nodeKey);
    }

    return affected;
  }

  public computeAllValues() {
    this.computedValues = {};

    for (const nodeKey of this.calculationOrder) {
      this.computeNode(nodeKey);
    }

    this.notify(new Set(Object.keys(this.computedValues) as DependencyKey[]));
  }

  private recomputeFromIndex(startIndex: number, affected: Set<DependencyKey>) {
    const changedKeys = new Set<DependencyKey>();

    for (let i = startIndex; i < this.calculationOrder.length; i++) {
      const nodeKey = this.calculationOrder[i];

      // If we have an affected set and this node is not affected, skip it.
      if (!affected.has(nodeKey)) continue;

      const changedByCompute = this.computeNode(nodeKey);
      for (const ck of changedByCompute) {
        changedKeys.add(ck);
      }
    }

    if (changedKeys.size === 0) return;
    this.notify(changedKeys);
  }

  public dispatchAction<
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
  ): void {
    const fullActionKey = unitKey.getActionKey(actionKey);
    const action = this.actionValues[fullActionKey] as TUnitActions[TActionKey];
    if (typeof action !== "function") {
      console.warn(
        `Action ${fullActionKey} is not a function or does not exist.`
      );
      return;
    }

    action(...args);
  }

  public getStateValue<
    Key extends string,
    T extends Record<string, unknown>,
    K extends keyof T,
  >(key: UnitKey<Key, T>, prop: K): T[K] {
    const state = key.getState(this.getGameState());
    if (!state) {
      throw new Error(`State for unit key ${key.toString()} is undefined.`);
    }

    return state[prop];
  }

  public hasComputedValue<
    Key extends string,
    TNodesObject extends UnitNodesObject,
    K extends keyof TNodesObject & string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(key: UnitKey<Key, any, TNodesObject>, prop: K): boolean {
    const value = key.getComputedValue(this.getGameState(), prop);
    return value !== undefined;
  }

  public getComputedDecimal<
    Key extends string,
    TNodesObject extends UnitNodesObject,
    K extends keyof TNodesObject & string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(key: UnitKey<Key, any, TNodesObject>, prop: K): Decimal {
    return key.getComputedDecimal(this.getGameState(), prop);
  }

  public getComputedNumber<
    Key extends string,
    TNodesObject extends UnitNodesObject,
    K extends keyof TNodesObject & string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(key: UnitKey<Key, any, TNodesObject>, prop: K): number {
    return key.getComputedNumber(this.getGameState(), prop);
  }

  public getComputedString<
    Key extends string,
    TNodesObject extends UnitNodesObject,
    K extends keyof TNodesObject & string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(key: UnitKey<Key, any, TNodesObject>, prop: K): string {
    return key.getComputedString(this.getGameState(), prop);
  }

  public getComputedBoolean<
    Key extends string,
    TNodesObject extends UnitNodesObject,
    K extends keyof TNodesObject & string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(key: UnitKey<Key, any, TNodesObject>, prop: K): boolean {
    return key.getComputedBoolean(this.getGameState(), prop);
  }

  public getComputedValue<
    Key extends string,
    TNodesObject extends UnitNodesObject,
    K extends keyof TNodesObject & string,
  >(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: UnitKey<Key, any, TNodesObject>,
    prop: K
  ): ComputableValue | undefined {
    return key.getComputedValue(this.getGameState(), prop);
  }

  public getUnitCount(key: UnitKey): Decimal {
    return key.getCount(this.getGameState()) || DecimalZero;
  }

  public getSaveGameState(): SaveGameState {
    return {
      ownedUnits: this.ownedUnits,
      unitStates: this.unitStates,
      lastTickTime: this.lastTickTime,
      gameVersion: GAME_VERSION,
      lastSavedTime: Date.now(),
    };
  }

  public loadGameState(saveState: SaveGameState) {
    this.ownedUnits = saveState.ownedUnits;
    this.unitStates = saveState.unitStates;
    this.lastTickTime = saveState.lastTickTime;

    this.computeAllValues();

    const allNonComputedKeys = new Set<DependencyKey>();
    for (const key of this.dependencyGraph.keys()) {
      if (!key.startsWith("$")) {
        allNonComputedKeys.add(key);
      }
    }

    this.notify(allNonComputedKeys);
  }

  public subscribe(keys: DependencyKey[], callback: () => void): () => void {
    for (const key of keys) {
      if (!this.subscriptions.has(key)) {
        this.subscriptions.set(key, new Set());
      }
      this.subscriptions.get(key)!.add(callback);
    }

    return () => {
      for (const key of keys) {
        this.subscriptions.get(key)?.delete(callback);
      }
    };
  }

  public debugPrintState(label?: string) {
    const { actionValues: _, ...originalState } = this.getGameState();

    const state = structuredClone(originalState);
    console.log(`Game State ${label ? `(${label})` : ""}:`, state);
  }

  public tick(deltaTime: number) {
    this.lastTickTime = Date.now();

    for (const unitKeyStr of this.blueprintsWithTick) {
      const blueprint = this.blueprintMap.get(unitKeyStr);
      if (!blueprint || !blueprint.tick) continue;

      blueprint.tick(deltaTime, this.getGameState(), {
        updateState: (k, updater) => this.updateState(k, updater),
        updateCount: (k, count) => this.updateCount(k, count),
        updateComputedStale: (k) => this.updateComputedStale(k),
        dispatchAction: (k, actionName, ...args) =>
          this.dispatchAction(k, actionName, ...args),
      });
    }
  }
}

export { Engine };
