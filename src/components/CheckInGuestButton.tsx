import { BigButton } from "../core/BigButton";
import { Tooltip } from "../core/Tooltip";
import { formatNumber } from "../settingsStore";
import { Sprite } from "../core/Sprite";
import { useEngineSelector } from "../engine/useEngineSelector";
import { Global } from "../units/System/Global";
import { useEngine } from "../engine/EngineContext";
import { Receptionist } from "../units/Staff/Receptionist";
import { Progress } from "../core/Progress";

const CheckInGuestButton: React.FC = () => {
  const engine = useEngine();

  const unlockedCheckIn = useEngineSelector(
    [Global.key.getComputedValueKey("unlockedCheckIn")],
    (engine) => () => engine.getComputedBoolean(Global.key, "unlockedCheckIn")
  );

  const cleanRooms = useEngineSelector(
    [Global.key.getComputedValueKey("cleanRooms")],
    (engine) => () => engine.getComputedDecimal(Global.key, "cleanRooms")
  );
  const totalRooms = useEngineSelector(
    [Global.key.getComputedValueKey("totalRooms")],
    (engine) => () => engine.getComputedDecimal(Global.key, "totalRooms")
  );

  const pendingCheckIns = useEngineSelector(
    [Receptionist.key.getStateValueKey("pendingCheckIns")],
    (engine) => () => engine.getStateValue(Receptionist.key, "pendingCheckIns")
  );

  if (!unlockedCheckIn) return null;

  return (
    <Tooltip content="Check in a guest to a clean room" side="bottom">
      <BigButton
        onClick={() => engine.dispatchAction(Global.key, "checkInGuest")}
        disabled={cleanRooms.lte(0)}
      >
        <Sprite type="checkIn" size={48} />
        Check In Guest ({formatNumber(cleanRooms)}/{formatNumber(totalRooms)})
        <Progress
          value={pendingCheckIns.toNumber()}
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

export { CheckInGuestButton };
