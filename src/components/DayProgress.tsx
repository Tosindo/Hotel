import { useMemo } from "react";
import { css } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { Progress } from "../core/Progress";
import { Sprite } from "../core/Sprite";
import { useEngineSelector } from "../engine/useEngineSelector";
import { Global } from "../units/System/Global";
import dayjs from "dayjs";
import { Stats } from "../units/System/Stats";
import { Tooltip } from "../core/Tooltip";

const DayProgress: React.FC = () => {
  const progress = useEngineSelector(
    [Global.key.getComputedValueKey("dailyProgress")],
    (engine) => () => engine.getComputedNumber(Global.key, "dailyProgress")
  );
  const firstCheckIn = useEngineSelector(
    [Stats.key.getStateValueKey("firstCheckInDone")],
    (engine) => () => engine.getStateValue(Stats.key, "firstCheckInDone")
  );

  const date = useEngineSelector(
    [Global.key.getComputedValueKey("date")],
    (engine) => () => engine.getComputedString(Global.key, "date")
  );

  const currentTime = useMemo(() => {
    // 0 -> 06:00, 1 -> 22:00
    if (progress === undefined || !firstCheckIn) return "06:00";

    const startOfDay = dayjs().hour(6).minute(0).second(0);
    const minutesToAdd = Math.floor(progress * (22 * 60 - 6 * 60));
    const time = startOfDay.add(minutesToAdd, "minute");

    return time.format("HH:mm");
  }, [progress, firstCheckIn]);

  return (
    <div
      className={flex({
        width: "full",
        flexShrink: 0,
      })}
    >
      <Tooltip content={date} side="bottom">
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
      </Tooltip>
      <Progress
        value={firstCheckIn ? (progress ?? 0) : 0}
        max={1}
        steps={40}
        css={{ borderTopWidth: 0 }}
      />
    </div>
  );
};

export default DayProgress;
