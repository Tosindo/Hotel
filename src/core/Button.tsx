import { styled } from "../../styled-system/jsx";

const Button = styled("button", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "retro-border-xs",
    shadow: "inset-retro-xs",
    borderColor: "retro.700",
    backgroundColor: "retro.400",
    color: "white",
    fontWeight: "bold",
    fontSize: "xs",
    cursor: "pointer",
    p: "2",
    gap: "2",
    _hover: {
      scale: "[105%]",
    },
    _active: {
      scale: "[95%]",
    },
    _disabled: {
      opacity: "0.6",
      cursor: "not-allowed",
      _hover: {
        scale: "auto",
      },
    },
  },

  variants: {
    variant: {
      outline: {
        backgroundColor: "transparent",
        color: "retro.700",
      },
      dark: {
        backgroundColor: "retro.600",
        color: "retro.200",
      },
      danger: {
        backgroundColor: "red.800",
        borderColor: "red.900",
        color: "white",
      },
    },
    size: {
      sm: {
        fontSize: "xs",
        p: "1",
        gap: "1",
      },
    },
  },
});

export { Button };
