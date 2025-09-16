import { BigButton } from "../core/BigButton";
import { useHotelStore } from "../hotelStore";
import { formatNumber } from "../settingsStore";
import { Bubbles } from "lucide-react";
import { Tooltip } from "../core/Tooltip";
import { flex } from "../../styled-system/patterns";
import { Progress } from "../core/Progress";

const CleanRoomButton: React.FC<{
  cleaningPercent?: number;
  isCleaning?: boolean;
}> = ({ cleaningPercent = 0, isCleaning = false }) => {
  const dirtyRooms = useHotelStore((s) => s.dirtyRooms);
  //const cleanRoomDuration = useComputedStore((s) => s.cleanRoomDuration);

  const onClick = () => {
    if (dirtyRooms.lte(0) || isCleaning) return;

    useHotelStore.getState().startCleaningCycle();
  };

  return (
    <Tooltip content="Clean a dirty room" side="bottom">
      <BigButton
        onClick={onClick}
        disabled={dirtyRooms.lte(0) || isCleaning}
        aria-busy={isCleaning ? "true" : "false"}
      >
        <div
          className={flex({
            width: "full",
            justifyContent: "center",
            fontSize: "2xl",
          })}
        >
          <Bubbles />
        </div>
        Clean Room{" "}
        {dirtyRooms.gte(0) ? <>({formatNumber(dirtyRooms)})</> : null}
        <Progress
          value={cleaningPercent}
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
      </BigButton>
    </Tooltip>
  );
};

export { CleanRoomButton };
