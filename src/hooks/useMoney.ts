import { useEngineSelector } from "../engine/useEngineSelector";
import { Global } from "../units/Global";

const useMoney = () => {
  return useEngineSelector(
    [Global.key.getStateValueKey("money")],
    (engine) => () => engine.getStateValue(Global.key, "money")
  );
};

export { useMoney };
