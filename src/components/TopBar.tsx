import { useComputedStore } from "../computedStore";
import { Bar, BarStat } from "../core/Bar";
import { useHotelStore } from "../hotelStore";
import { formatNumber } from "../settingsStore";
import { Sprite } from "../core/Sprite";
import { Settings } from "./Settings";

const TopBar: React.FC = () => {
  const money = useHotelStore((s) => s.money);
  const incomePerSecond = useComputedStore((s) => s.incomePerSecond);

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
      <Settings />
    </Bar>
  );
};

export { TopBar };
