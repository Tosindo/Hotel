import { BanknoteArrowUp, Wallet } from "lucide-react";
import { useComputedStore } from "../computedStore";
import { Bar, BarStat } from "../core/Bar";
import { useHotelStore } from "../hotelStore";
import { formatNumber } from "../settingsStore";

const TopBar: React.FC = () => {
  const money = useHotelStore((s) => s.money);
  const incomePerSecond = useComputedStore((s) => s.incomePerSecond);

  return (
    <Bar variant="light" css={{ p: "1", gap: "2" }}>
      <BarStat
        css={{ width: "28" }}
        icon={<Wallet />}
        tooltipContent="Total Money"
      >
        {formatNumber(money, false)}
      </BarStat>
      <BarStat icon={<BanknoteArrowUp />} tooltipContent="Income per second">
        {formatNumber(incomePerSecond, false)}/s
      </BarStat>
    </Bar>
  );
};

export { TopBar };
