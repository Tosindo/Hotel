import Decimal from "break_infinity.js";
import type {
  ActionKey,
  ComputableValue,
  ComputedDependencyKey,
  CountDependencyKey,
  GameState,
  StateDependencyKey,
  UnitActionsObject,
  UnitNodesObject,
} from "./types";
import { DecimalZero } from "./constants";

class UnitKey<
  Key extends string = string,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TNodesObject extends UnitNodesObject = UnitNodesObject,
  TActionsObject extends UnitActionsObject = UnitActionsObject,
> {
  key: Key;

  constructor(key: Key) {
    this.key = key;
  }

  toString() {
    return this.key;
  }

  getComputedValueKey(key: keyof TNodesObject & string): ComputedDependencyKey {
    return `$${this.key}:${key}`;
  }

  getStateValueKey(key: keyof TState): StateDependencyKey {
    return `#${this.key}:${String(key)}`;
  }

  getCountKey(): CountDependencyKey {
    return `*${this.key}`;
  }

  getState(gameState: GameState): TState | undefined {
    return gameState.unitStates[this.key] as TState | undefined;
  }

  getComputedValue(
    gameState: GameState,
    key: keyof TNodesObject & string
  ): ComputableValue | undefined {
    return gameState.computedValues[this.getComputedValueKey(key)];
  }

  getComputedDecimal(
    gameState: GameState,
    key: keyof TNodesObject & string
  ): Decimal {
    const value = this.getComputedValue(gameState, key);

    if (!(value instanceof Decimal)) {
      throw new Error(
        `Computed value for key ${this.getComputedValueKey(
          key
        )} is not a Decimal.`
      );
    }

    return value;
  }

  getComputedNumber(
    gameState: GameState,
    key: keyof TNodesObject & string
  ): number {
    const value = this.getComputedValue(gameState, key);

    if (typeof value !== "number") {
      throw new Error(
        `Computed value for key ${this.getComputedValueKey(
          key
        )} is not a number.`
      );
    }

    return value;
  }

  getComputedString(
    gameState: GameState,
    key: keyof TNodesObject & string
  ): string {
    const value = this.getComputedValue(gameState, key);

    if (typeof value !== "string") {
      throw new Error(
        `Computed value for key ${this.getComputedValueKey(
          key
        )} is not a string.`
      );
    }

    return value;
  }

  getComputedBoolean(
    gameState: GameState,
    key: keyof TNodesObject & string
  ): boolean {
    const value = this.getComputedValue(gameState, key);

    if (typeof value !== "boolean") {
      throw new Error(
        `Computed value for key ${this.getComputedValueKey(
          key
        )} is not a boolean.`
      );
    }

    return value;
  }

  getComputedNull(
    gameState: GameState,
    key: keyof TNodesObject & string
  ): null {
    const value = this.getComputedValue(gameState, key);

    if (value !== null) {
      throw new Error(
        `Computed value for key ${this.getComputedValueKey(key)} is not null.`
      );
    }

    return value;
  }

  hasComputedValue(
    gameState: GameState,
    key: keyof TNodesObject & string
  ): boolean {
    return this.getComputedValue(gameState, key) !== undefined;
  }

  getCount(gameState: GameState): Decimal {
    return gameState.ownedUnits[this.key] || DecimalZero;
  }

  getActionKey(actionKey: keyof TActionsObject & string): ActionKey {
    return `@${this.key}:${actionKey}`;
  }

  getAction<TAction extends keyof TActionsObject & string>(
    gameState: GameState,
    actionKey: TAction
  ): TActionsObject[TAction] {
    return gameState.actionValues[
      this.getActionKey(actionKey)
    ] as TActionsObject[TAction];
  }
}

export { UnitKey };
