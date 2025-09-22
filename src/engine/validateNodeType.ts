import Decimal from "break_infinity.js";
import type { ComputableValue, ValueNode } from "./types";

const validateNodeType = (node: ValueNode, value: ComputableValue) => {
  switch (node.returnType) {
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

export { validateNodeType };
