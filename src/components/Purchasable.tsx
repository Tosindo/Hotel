import type Decimal from "break_infinity.js";
import { Bar } from "../core/Bar";
import { Button } from "../core/Button";
import { formatNumber } from "../settingsStore";
import { Banknote, Check } from "lucide-react";
import { Tooltip } from "../core/Tooltip";
import { useHotelStore } from "../hotelStore";

interface PurchasablesProps {
  label: string;
  buttonLabel: string;
  tooltipContent?: string;
  count?: Decimal;
  cost: Decimal;
  onPurchase: () => void;
  purchased?: boolean;
}

export const Purchasable: React.FC<PurchasablesProps> = ({
  label,
  buttonLabel,
  count,
  cost,
  onPurchase,
  tooltipContent = "",
  purchased = false,
}) => {
  const money = useHotelStore((s) => s.money);

  return (
    <Tooltip content={tooltipContent} side="bottom">
      <Bar
        variant="lighter"
        css={{
          justifyContent: "space-between",
        }}
      >
        {label} {count && `(${formatNumber(count)})`}
        <Button onClick={onPurchase} disabled={purchased || money.lt(cost)}>
          {purchased ? (
            <Check />
          ) : (
            <>
              {buttonLabel} {formatNumber(cost, false)}
              <Banknote />
            </>
          )}
        </Button>
      </Bar>
    </Tooltip>
  );
};
