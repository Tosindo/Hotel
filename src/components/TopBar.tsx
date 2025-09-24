import { Bar, BarStat } from "../core/Bar";
import { formatNumber } from "../settingsStore";
import { Sprite } from "../core/Sprite";
import { Settings } from "./Settings";
import { useMoney } from "../hooks/useMoney";
import { useEngineSelector } from "../engine/useEngineSelector";
import { Global } from "../units/System/Global";
import { Cleaning } from "../units/Staff/Cleaning";
import { Receptionist } from "../units/Staff/Receptionist";
import { DecimalZero } from "../engine/constants";
import { PenAndPaper } from "../units/Services/PenAndPaper";

const TopBar: React.FC = () => {
  const money = useMoney();
  const incomePerSecond = useEngineSelector(
    [Global.key.getComputedValueKey("incomePerSecond")],
    (engine) => () => engine.getComputedDecimal(Global.key, "incomePerSecond")
  );

  const cleaningRate = useEngineSelector(
    [Cleaning.key.getComputedValueKey("cleaningRate")],
    (engine) => () => engine.getComputedDecimal(Cleaning.key, "cleaningRate")
  );

  const checkInRate = useEngineSelector(
    [Receptionist.key.getComputedValueKey("checkInRate")],
    (engine) => () => engine.getComputedDecimal(Receptionist.key, "checkInRate")
  );

  const showAvailableGuests = useEngineSelector(
    [PenAndPaper.key.getCountKey()],
    (engine) => () => engine.getUnitCount(PenAndPaper.key).gt(0)
  );

  const availableGuests = useEngineSelector(
    [Global.key.getStateValueKey("availableGuests")],
    (engine) => () => engine.getStateValue(Global.key, "availableGuests")
  );

  return (
    <Bar variant="light" css={{ p: "1", gap: "2", flexShrink: 0 }}>
      <BarStat
        css={{ width: "36" }}
        icon={<Sprite type="money" size={32} />}
        tooltipContent="Total Money"
      >
        {formatNumber(money, false)}
      </BarStat>
      <BarStat
        css={{ width: "44" }}
        icon={<Sprite type="income" size={32} />}
        tooltipContent="Income per second"
      >
        {formatNumber(incomePerSecond, false)}/s
      </BarStat>

      {showAvailableGuests && (
        <BarStat
          css={{ width: "44" }}
          icon={<Sprite type="people" size={32} />}
          tooltipContent="Available Guests"
        >
          {formatNumber(availableGuests, false)}
        </BarStat>
      )}

      {checkInRate.gt(DecimalZero) && (
        <BarStat
          css={{ width: "44" }}
          icon={<Sprite type="checkIn" size={32} />}
          tooltipContent="Check-in rate (rooms per second)"
        >
          {formatNumber(checkInRate, false)}/s
        </BarStat>
      )}

      {cleaningRate.gt(DecimalZero) && (
        <BarStat
          css={{ width: "44" }}
          icon={<Sprite type="cleaning" size={32} />}
          tooltipContent="Cleaning rate (rooms per second)"
        >
          {formatNumber(cleaningRate, false)}/s
        </BarStat>
      )}

      <Settings />
    </Bar>
  );
};

export { TopBar };
