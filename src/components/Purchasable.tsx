import type Decimal from "break_infinity.js";
import { Bar } from "../core/Bar";
import { Button } from "../core/Button";
import { formatNumber } from "../settingsStore";
import { Tooltip } from "../core/Tooltip";
import { useHotelStore } from "../hotelStore";
import { vstack } from "../../styled-system/patterns";
import { css } from "../../styled-system/css";
import { Sprite, type SpriteType } from "../core/Sprite";

interface PurchasablesProps {
  spriteType?: SpriteType;
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
  spriteType = "unknown",
}) => {
  const money = useHotelStore((s) => s.money);

  return (
    <Tooltip content={tooltipContent} side="bottom">
      <Bar
        variant="lighter"
        css={{
          gap: "4",
          flexShrink: 0,
          border: "none",
          borderBottom: "retro-border-xs",
          _last: {
            borderBottom: "none",
          },
        }}
      >
        <div
          className={css({
            border: "retro-border",
            padding: "1",
            borderColor: "retro.700",
            w: "[48px]",
            h: "[48px]",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-start",
            color: "retro.700",
          })}
        >
          <Sprite type={spriteType} size={32} />
        </div>
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
            marginLeft: "auto",
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
              <Sprite type="check" size={16} />
            ) : (
              <>
                {formatNumber(cost, false)}
                <Sprite type="bankNote" size={16} />
              </>
            )}
          </Button>
        </div>
      </Bar>
    </Tooltip>
  );
};
