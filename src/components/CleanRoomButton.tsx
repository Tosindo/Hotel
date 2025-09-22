import { BigButton } from "../core/BigButton";
import { formatNumber } from "../settingsStore";
import { Tooltip } from "../core/Tooltip";
import { Progress } from "../core/Progress";
import { Sprite } from "../core/Sprite";
import { useEngine } from "../engine/EngineContext";
import { useEngineSelector } from "../engine/useEngineSelector";
import { Global } from "../units/Global";
import { Cleaning } from "../units/Staff/Cleaning";

const CleanRoomButton: React.FC = () => {
  const engine = useEngine();

  const dirtyRooms = useEngineSelector(
    [Global.key.getStateValueKey("dirtyRooms")],
    (engine) => () => engine.getStateValue(Global.key, "dirtyRooms")
  );

  const isCleaning = useEngineSelector(
    [Global.key.getStateValueKey("cleaningCycleStartTime")],
    (engine) => () =>
      engine.getStateValue(Global.key, "cleaningCycleStartTime") !== null
  );

  const progress = useEngineSelector(
    [Global.key.getComputedValueKey("cleaningProgress")],
    (engine) => () => engine.getComputedNumber(Global.key, "cleaningProgress")
  );

  const pendingCleanings = useEngineSelector(
    [Cleaning.key.getStateValueKey("pendingCleanings")],
    (engine) => () => engine.getStateValue(Cleaning.key, "pendingCleanings")
  );

  const onClick = () => {
    if (dirtyRooms.lte(0) || isCleaning) return;

    engine.dispatchAction(Global.key, "startCleaning");
  };

  return (
    <Tooltip content="Clean a dirty room" side="bottom">
      <BigButton
        onClick={onClick}
        disabled={dirtyRooms.lte(0) || isCleaning}
        aria-busy={isCleaning ? "true" : "false"}
      >
        <Sprite type="cleaning" size={48} />
        Clean Room{" "}
        {dirtyRooms.gte(0) ? <>({formatNumber(dirtyRooms)})</> : null}
        <Progress
          value={progress}
          max={1}
          steps={8}
          css={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "full",
            height: "2",
            backgroundColor: "transparent",
            zIndex: "0",
            borderWidth: "0",
          }}
        />
        <Progress
          value={pendingCleanings.toNumber()}
          max={1}
          steps={8}
          css={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "full",
            height: "2",
            backgroundColor: "transparent",
            zIndex: "0",
            borderWidth: "0",
            opacity: 0.3,
          }}
        />
      </BigButton>
    </Tooltip>
  );
};

export { CleanRoomButton };
