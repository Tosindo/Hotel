import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";
import type { ComponentProps } from "react";
import { css } from "../../styled-system/css";

const Tabs: React.FC<ComponentProps<typeof TabsPrimitive.Root>> = ({
  className,
  ...props
}) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={clsx(
        css({
          display: "flex",
          flexDirection: "column",
          width: "full",
        }),
        className
      )}
      {...props}
    />
  );
};

const TabsList: React.FC<ComponentProps<typeof TabsPrimitive.List>> = ({
  className,
  ...props
}) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={clsx(
        css({
          position: "relative",
          display: "inline-flex",
          w: "fit",
          alignItems: "center",
          justifyContent: "center",
          px: "0",
        }),
        className
      )}
      {...props}
    />
  );
};

const TabsTrigger: React.FC<ComponentProps<typeof TabsPrimitive.Trigger>> = ({
  className,
  ...props
}) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={clsx(
        css({
          px: "4",
          py: "2",
          border: "retro-border",
          fontWeight: "bold",

          shadow: "inset-retro",
          borderColor: "retro.700",
          borderBottom: "none",
          bg: "retro.500",
          position: "relative",
          fontSize: "md",

          cursor: "pointer",

          ["&:first-child:not([data-state='active']), & + &:not(:last-child):not([data-state='active'])"]:
            {
              borderRight: "none",
            },

          ["&[data-state='active']"]: {
            bg: "retro.300",
            borderBottomColor: "transparent",
            shadow: "[none]",
            cursor: "default",
            color: "retro.900",

            top: "-1",
            _before: {
              content: '" "',
              position: "absolute",
              bottom: "-2",
              left: "-1",
              w: "[calc(100% + 0.5rem)]",
              h: "3",
              bg: "retro.300",
              borderLeft: "retro-border",
              borderRight: "retro-border",
              borderLeftColor: "retro.700",
              borderRightColor: "retro.700",
            },
          },

          ["&[data-state='active'] + &"]: {
            borderLeft: "none",
          },
        }),
        className
      )}
      {...props}
    />
  );
};

const TabsContent: React.FC<ComponentProps<typeof TabsPrimitive.Content>> = ({
  className,
  ...props
}) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={clsx(
        css({
          flexGrow: 1,
          bg: "retro.300",
          border: "retro-border",
          borderColor: "retro.700",
        }),
        className
      )}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
