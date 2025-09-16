import { css, type Styles } from "../../styled-system/css";

interface ProgressProps extends React.PropsWithChildren {
  value: number;
  max: number;
  min?: number;
  steps?: number;
  css?: Styles;
}

const rootStyles = css.raw({
  display: "flex",
  background: "retro.500",
  border: "retro-border",
  borderColor: "retro.700",
  flexGrow: 1,
  overflow: "hidden",
  position: "relative",
  padding: "2",
  height: "8",
  justifyContent: "center",
  alignItems: "center",
});

const barContainerStyles = css({
  display: "flex",
  gap: "2",
  padding: "1",
  width: "full",
  height: "full",
  position: "absolute",
  top: "0",
  left: "0",
  overflow: "hidden",
});

const barStyles = css({
  background: "retro.800",
  height: "full",
});

const Progress: React.FC<ProgressProps> = ({
  value,
  max,
  min = 0,
  steps = 10,
  css: cssProp,
  children,
}) => {
  return (
    <div className={css(rootStyles, cssProp)}>
      <div className={barContainerStyles}>
        {Array.from({ length: steps }).map((_, i) => {
          const stepValue = min + ((max - min) / steps) * (i + 1);
          const isActive = value >= stepValue;
          return (
            <div
              key={i}
              className={barStyles}
              style={{
                width: `${100 / steps}%`,
                opacity: isActive ? 1 : 0,
              }}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
};

export { Progress };
