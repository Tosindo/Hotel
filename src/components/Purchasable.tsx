import { Bar } from "../core/Bar";
import { Button } from "../core/Button";
import { formatNumber } from "../settingsStore";
import { Tooltip } from "../core/Tooltip";
import { vstack } from "../../styled-system/patterns";
import { css } from "../../styled-system/css";
import { Sprite } from "../core/Sprite";
import type { UnitBlueprint } from "../engine/types";
import { useEngineSelector } from "../engine/useEngineSelector";
import { useMoney } from "../hooks/useMoney";
import { useMemo } from "react";
import { useEngine } from "../engine/EngineContext";
import { Global } from "../units/Global";
import { DecimalZero } from "../engine/constants";
import useDisplayable from "../hooks/useDisplayable";

interface PurchasablesProps {
  unit: UnitBlueprint;
}

export const Purchasable: React.FC<PurchasablesProps> = ({ unit }) => {
  const engine = useEngine();
  const {
    name,
    description,
    sprite: spriteType,
    tooltipContent,
  } = useDisplayable(unit);

  const money = useMoney();

  const count = useEngineSelector(
    [unit.key.getCountKey()],
    (engine) => () => engine.getUnitCount(unit.key)
  );

  const cost = useEngineSelector(
    [unit.key.getComputedValueKey("cost")],
    (engine) => () => engine.getComputedDecimal(unit.key, "cost")
  );

  const max = useEngineSelector(
    [unit.key.getComputedValueKey("max")],
    (engine) => () =>
      engine.hasComputedValue(unit.key, "max")
        ? engine.getComputedDecimal(unit.key, "max")
        : undefined
  );

  const purchased = useMemo(() => {
    if (!max) return false;

    return count.eq(max);
  }, [count, max]);

  const singlePurchased = unit.metadata?.singlePurchase === true && purchased;

  const isDisabled =
    purchased ||
    (cost.gt(DecimalZero) && money.lt(cost)) ||
    (max && count && count.gte(max));

  const onPurchase = () => {
    if (isDisabled) return;
    engine.dispatchAction(Global.key, "purchaseUnit", unit, 1);
  };

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
        style={{
          opacity: singlePurchased ? 0.5 : 1,
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
            {name}{" "}
            {unit.metadata?.singlePurchase !== true &&
              count &&
              `(${formatNumber(count)}${max ? `/${formatNumber(max)}` : ""})`}
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
            disabled={isDisabled}
            css={{
              whiteSpace: "nowrap",
            }}
          >
            {purchased ? (
              <Sprite type="check" size={16} />
            ) : (
              <>
                {formatNumber(cost)}
                <Sprite type="bankNote" size={16} />
              </>
            )}
          </Button>
        </div>
      </Bar>
    </Tooltip>
  );
};
