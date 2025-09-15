import { useState } from "react";
import { BigButton } from "../core/BigButton";
import { useHotelStore } from "../hotelStore";
import { formatNumber } from "../settingsStore";
import { useMotionValue, motion, useTransform } from "motion/react";
import { animate } from "motion";
import { css } from "../../styled-system/css";
import { Bubbles } from "lucide-react";
import { Tooltip } from "../core/Tooltip";
import { flex } from "../../styled-system/patterns";
import { useComputedStore } from "../computedStore";

const progressStyles = css({
  position: "absolute",
  top: "0",
  left: "0",
  height: "full",
  width: "0",
  backgroundColor: "retro.100",
  zIndex: "0",
  opacity: "0.5",
});

const CleanRoomButton: React.FC = () => {
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v}%`);
  const [cleaning, setCleaning] = useState(false);

  const dirtyRooms = useHotelStore((s) => s.dirtyRooms);
  const cleanRoomDuration = useComputedStore((s) => s.cleanRoomDuration);

  const onClick = () => {
    if (progress.get() !== 0 || cleaning) return;

    setCleaning(true);
    animate(progress, 100, {
      duration: cleanRoomDuration / 1000,
      onComplete: () => {
        useHotelStore.getState().cleanRoom();
        progress.set(0);
        setCleaning(false);
      },
      onStop: () => {
        progress.set(0);
        setCleaning(false);
      },
      ease: "linear",
    });
  };

  return (
    <Tooltip content="Clean a dirty room" side="bottom">
      <BigButton
        onClick={onClick}
        disabled={dirtyRooms.lte(0) || cleaning}
        aria-busy={cleaning ? "true" : "false"}
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
        <motion.div className={progressStyles} style={{ width }} />
      </BigButton>
    </Tooltip>
  );
};

export { CleanRoomButton };
