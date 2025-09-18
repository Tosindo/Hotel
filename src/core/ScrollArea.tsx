import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import type { ComponentProps } from "react";
import { css, cva } from "../../styled-system/css";

const ScrollArea: React.FC<ComponentProps<typeof ScrollAreaPrimitive.Root>> = ({
  className,
  children,
  type = "auto",
  ...props
}) => {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type={type}
      className={clsx(
        css({
          position: "relative",
        }),
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Corner />
      <ScrollBar />
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={css({
          w: "full",
          h: "full",
          transition: "[color, box-shadow]",
          outline: "none",
        })}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
    </ScrollAreaPrimitive.Root>
  );
};

const scrollBarStyles = cva({
  base: {
    display: "flex",
    touchAction: "none",
    p: "1",
    transition: "colors",
    userSelect: "none",
    bg: "retro.400",
    zIndex: "1",
  },
  variants: {
    orientation: {
      vertical: {
        height: "full",
        width: "8",
        borderLeft: "retro-border",
        borderLeftColor: "retro.700",

        ["& + [data-slot='scroll-area-viewport'], & + style + [data-slot='scroll-area-viewport']"]:
          {
            paddingRight: "8",
          },
      },
      horizontal: {
        height: "8",
        width: "full",
        borderTop: "retro-border",
        borderTopColor: "retro.700",

        ["& + [data-slot='scroll-area-viewport'], & + style + [data-slot='scroll-area-viewport']"]:
          {
            paddingBottom: "8",
          },
      },
    },
  },
});

const ScrollBar: React.FC<
  ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
> = ({ className, orientation = "vertical", ...props }) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={clsx(scrollBarStyles({ orientation }), className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={css({
          bg: "retro.600",
          border: "retro-border-xs",
          shadow: "inset-retro-xs",
          borderColor: "retro.900",
          flex: "1",
        })}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
};

export { ScrollArea, ScrollBar };
