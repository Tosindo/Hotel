import { useMemo } from "react";
import { css } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { Progress } from "../core/Progress";
import { Sprite } from "../core/Sprite";
import { useEngineSelector } from "../engine/useEngineSelector";
import { Global } from "../units/Global";
import dayjs from "dayjs";

const DayProgress: React.FC = () => {
  const progress = useEngineSelector(
    [Global.key.getComputedValueKey("dailyProgress")],
    (engine) => () => engine.getComputedNumber(Global.key, "dailyProgress")
  );

  const currentTime = useMemo(() => {
    // 0 -> 14:00, 1 -> 14:00
    if (progress === undefined) return "14:00";

    const startOfDay = dayjs().hour(14).minute(0).second(0);
    const minutesToAdd = Math.floor(progress * 24 * 60);
    const time = startOfDay.add(minutesToAdd, "minute");

    return time.format("HH:mm");
  }, [progress]);

  return (
    <div
      className={flex({
        width: "full",
        flexShrink: 0,
      })}
    >
      <div
        className={flex({
          zIndex: "1",
          color: "white",
          gap: "2",
          mixBlendMode: "hard-light",
          fontSize: "md",
          alignItems: "center",
          justifyContent: "center",
          width: "32",
          border: "retro-border",
          borderColor: "retro.800",
          borderTopWidth: "0",
          background: "retro.800",
        })}
      >
        <Sprite type="clock" size={16} />
        <span
          className={css({
            fontWeight: "bold",
          })}
        >
          {currentTime}
        </span>
      </div>
      <Progress
        value={progress ?? 0}
        max={1}
        steps={40}
        css={{ borderTopWidth: 0 }}
      />
    </div>
  );
};

export default DayProgress;
