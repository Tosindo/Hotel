import Decimal from "break_infinity.js";
import type {
  ComputableValue,
  ComputableValueFromReturnType,
  ReturnTypes,
} from "./types";

const validateComputedValue = <
  R extends ReturnTypes,
  T extends ComputableValue = ComputableValueFromReturnType<R>,
>(
  returnType: R,
  value: ComputableValue | undefined
): value is T => {
  switch (returnType) {
    case "decimal":
      return value instanceof Decimal;
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "string":
      return typeof value === "string";
    case "null":
      return value === null;
    default:
      return true;
  }
};

export { validateComputedValue };
