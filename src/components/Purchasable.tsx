import type Decimal from "break_infinity.js";
import { Bar } from "../core/Bar";
import { Button } from "../core/Button";
import { formatNumber } from "../settingsStore";
import { Banknote, Check } from "lucide-react";
import { Tooltip } from "../core/Tooltip";
import { useHotelStore } from "../hotelStore";
import { vstack } from "../../styled-system/patterns";
import { css } from "../../styled-system/css";

interface PurchasablesProps {
  label: string;
  description?: string;
  tooltipContent?: string;
  count?: Decimal;
  maxCount?: Decimal;
  cost: Decimal;
  onPurchase: () => void;
  purchased?: boolean;
}

export const Purchasable: React.FC<PurchasablesProps> = ({
  label,
  description,
  count,
  maxCount,
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
          gap: "4",
          flexShrink: 0,
        }}
      >
        <div className={vstack({ gap: "1", alignItems: "flex-start" })}>
          <span className={css({ fontSize: "md", fontWeight: "bold" })}>
            {label}{" "}
            {count &&
              `(${formatNumber(count)}${maxCount ? `/${formatNumber(maxCount)}` : ""})`}
          </span>
          {description && (
            <span
              className={css({
                fontSize: "sm",
                fontWeight: "bold",
                color: "retro.900",
              })}
            >
              {description}
            </span>
          )}
        </div>
        <div
          className={css({
            display: "flex",
            alignItems: "flex-end",
            height: "full",
          })}
        >
          <Button
            onClick={onPurchase}
            disabled={
              purchased ||
              money.lt(cost) ||
              (maxCount && count && count.gte(maxCount))
            }
            css={{
              whiteSpace: "nowrap",
            }}
          >
            {purchased ? (
              <Check />
            ) : (
              <>
                {formatNumber(cost, false)}
                <Banknote />
              </>
            )}
          </Button>
        </div>
      </Bar>
    </Tooltip>
  );
};
