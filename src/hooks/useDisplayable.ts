import type { UnitBlueprint } from "../engine/types";
import { useEngineSelector } from "../engine/useEngineSelector";
import { stringToSprite } from "../utils/stringToSprite";

const useDisplayable = (unit: UnitBlueprint) => {
  const name = useEngineSelector(
    [unit.key.getComputedValueKey("name")],
    (engine) => () =>
      unit.metadata?.displayable === true
        ? engine.getComputedString(unit.key, "name")
        : ""
  );
  const description = useEngineSelector(
    [unit.key.getComputedValueKey("description")],
    (engine) => () =>
      unit.metadata?.displayable === true
        ? engine.getComputedString(unit.key, "description")
        : ""
  );
  const tooltipContent = useEngineSelector(
    [unit.key.getComputedValueKey("tooltipContent")],
    (engine) => () =>
      engine.hasComputedValue(unit.key, "tooltipContent")
        ? engine.getComputedString(unit.key, "tooltipContent")
        : ""
  );
  const sprite = useEngineSelector(
    [unit.key.getComputedValueKey("sprite")],
    (engine) => () =>
      unit.metadata?.displayable === true
        ? stringToSprite(engine.getComputedString(unit.key, "sprite"))
        : "unknown"
  );

  return { name, description, tooltipContent, sprite };
};

export default useDisplayable;
