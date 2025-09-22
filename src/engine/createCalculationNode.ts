import type { ModifierNode, ValueNode } from "./types";

export function createValueNode(config: Omit<ValueNode, "type">): ValueNode {
  return {
    type: "value",
    ...config,
  };
}

export function createModifierNode(
  config: Omit<ModifierNode, "type">
): ModifierNode {
  return {
    type: "modifier",
    ...config,
  };
}
