import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { css, type Styles } from "../../styled-system/css";
import clsx from "clsx";

const TooltipProvider: React.FC<
  React.ComponentProps<typeof TooltipPrimitive.Provider>
> = ({ delayDuration = 0, disableHoverableContent = true, ...props }) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
      {...props}
    />
  );
};

const TooltipRoot: React.FC<
  React.ComponentProps<typeof TooltipPrimitive.Tooltip>
> = ({ ...props }) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
};

const TooltipTrigger: React.FC<
  React.ComponentProps<typeof TooltipPrimitive.Trigger>
> = ({ ...props }) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
};

const styles = css.raw({
  bg: "retro.700",
  shadow: "retro-xs",
  border: "retro-border-xs",
  borderColor: "retro.900",
  color: "white",
  opacity: 1,
  zIndex: 50,
  width: "fit",
  transformOrigin: "[--radix-tooltip-content-transform-origin]",
  px: "3",
  py: "1.5",
  fontSize: "md",
  textWrap: "balance",
  _closed: {
    opacity: 0,
  },
});

const TooltipContent: React.FC<
  Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "content"> & {
    css?: Styles;
  }
> = ({ className, sideOffset = 10, children, css: cssProp, ...props }) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={clsx(css(styles, cssProp), className)}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

interface TooltipProps extends React.ComponentProps<typeof TooltipContent> {
  content: React.ReactNode | undefined;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, ...props }) => {
  return (
    <TooltipRoot open={!content ? false : undefined}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...props}>{content}</TooltipContent>
    </TooltipRoot>
  );
};

export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
};
