import { forwardRef, type ComponentProps } from "react";
import { css } from "../../styled-system/css";

const styles = css({
  display: "flex",
  alignItems: "center",
  shadow: "inset-retro",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "44",
  height: "44",
  borderWidth: "4",
  p: "4",
  borderColor: "retro.700",
  color: "retro.700",
  fontWeight: "bold",
  fontSize: "md",
  "& svg": {
    fontSize: "2xl",
  },
  "--cursor": "pointer",
  translate: "auto",
  _hover: {
    scale: "[105%]",
  },
  _active: {
    scale: "[95%]",
  },
  _disabled: {
    opacity: "0.6",
    "--cursor": "not-allowed",
    _hover: {
      scale: "auto",
    },
  },
  _loading: {
    opacity: "1",
    "--cursor": "wait",
  },
  transition: "all",
  transitionDuration: "fast",
  transitionTimingFunction: "in-out",
  position: "relative",
});

const BigButton = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({ onClick, children, ...props }, ref) => {
    return (
      <button className={styles} onClick={onClick} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

BigButton.displayName = "BigButton";

export { BigButton };
