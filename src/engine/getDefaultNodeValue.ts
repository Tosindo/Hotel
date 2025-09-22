import {
  BooleanFalse,
  DecimalZero,
  NullValue,
  NumberZero,
  StringEmpty,
} from "./constants";
import type { ComputableValue, ValueNode } from "./types";

const getDefaultNodeValue = (node: ValueNode): ComputableValue => {
  switch (node.returnType) {
    case "decimal":
      return DecimalZero;
    case "number":
      return NumberZero;
    case "boolean":
      return BooleanFalse;
    case "string":
      return StringEmpty;
    case "null":
      return NullValue;
    default:
      return NullValue;
  }
};

export { getDefaultNodeValue };
