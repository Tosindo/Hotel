import { css, type Styles } from "../../styled-system/css";
import { styled } from "../../styled-system/jsx";
import { flex } from "../../styled-system/patterns";
import { Tooltip } from "./Tooltip";

const Bar = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    background: "retro.600",
    border: "retro-border",
    borderColor: "retro.700",
    width: "full",
    overflow: "hidden",
    position: "relative",
    padding: "2",

    ["& + &"]: {
      borderTopWidth: "0",
    },
  },
  variants: {
    variant: {
      light: {
        background: "retro.500",
      },
      lighter: {
        background: "retro.300",
        color: "black",
      },
    },
  },
});

interface BarStatProps extends React.PropsWithChildren {
  icon: React.ReactNode;
  tooltipContent?: React.ReactNode;
  css?: Styles;
}

const BarStat: React.FC<BarStatProps> = ({
  icon,
  children,
  tooltipContent,
  css: cssProp,
}) => {
  return (
    <Tooltip content={tooltipContent} side="bottom">
      <div
        className={css(
          {
            display: "flex",
          },
          cssProp
        )}
      >
        <div
          className={flex({
            padding: "2",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "lg",
            shadow: "inset-retro-xs",
            bg: "retro.600",
            border: "retro-border-xs",
            borderColor: "retro.800",
          })}
        >
          {icon}
        </div>
        <div
          className={flex({
            borderLeft: "none",
            padding: "2",
            fontSize: "lg",
            shadow: "inset-retro-xs",
            bg: "retro.500",
            border: "retro-border-xs",
            borderColor: "retro.700",
            flexGrow: 1,
            justifyContent: "flex-end",
          })}
        >
          {children}
        </div>
      </div>
    </Tooltip>
  );
};

export { Bar, BarStat };
