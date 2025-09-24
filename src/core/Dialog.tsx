import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import type { ComponentProps } from "react";
import { css } from "../../styled-system/css";
import { Sprite } from "./Sprite";
import { srOnly } from "../../styled-system/recipes";
import { Button } from "./Button";

const Dialog: React.FC<ComponentProps<typeof DialogPrimitive.Root>> = ({
  children,
  ...props
}) => {
  return (
    <DialogPrimitive.Root data-slot="dialog" {...props}>
      {children}
    </DialogPrimitive.Root>
  );
};

const DialogTrigger: React.FC<
  ComponentProps<typeof DialogPrimitive.Trigger>
> = ({ children, ...props }) => {
  return (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
};

const DialogPortal: React.FC<ComponentProps<typeof DialogPrimitive.Portal>> = ({
  children,
  ...props
}) => {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...props}>
      {children}
    </DialogPrimitive.Portal>
  );
};

const DialogClose: React.FC<ComponentProps<typeof DialogPrimitive.Close>> = ({
  children,
  ...props
}) => {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" {...props}>
      {children}
    </DialogPrimitive.Close>
  );
};

const DialogOverlay: React.FC<
  ComponentProps<typeof DialogPrimitive.Overlay>
> = ({ className, children, ...props }) => {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={clsx(
        css({
          position: "fixed",
          inset: "0",
          zIndex: 50,
          bg: "retro.900",
          opacity: 0.4,
          cursor: "none",
        }),
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Overlay>
  );
};

const DialogContent: React.FC<
  ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
  }
> = ({ className, children, showCloseButton = true, ...props }) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={clsx(
          css({
            bg: "retro.300",
            border: "retro-border",
            borderColor: "retro.500",
            shadow: "retro",
            position: "fixed",
            top: "[50%]",
            left: "[50%]",
            zIndex: 50,
            display: "grid",
            w: "full",
            maxW: "[600px]",
            x: "-1/2",
            y: "-1/2",
            translate: "auto",
            gap: "4",
            cursor: "none",
            p: "8",
          }),
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <Button
            as={DialogClose}
            className={css({
              position: "absolute",
              top: "4",
              right: "4",
              opacity: 0.7,
              transition: "opacity",
              _hover: { opacity: 1 },
            })}
            size="sm"
          >
            <Sprite type="close" size={18} />
            <span className={srOnly()}>Close</span>
          </Button>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

const DialogHeader: React.FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="dialog-header"
      className={clsx(
        css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
          textAlign: "center",
        }),
        className
      )}
      {...props}
    />
  );
};

const DialogFooter: React.FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="dialog-footer"
      className={clsx(
        css({
          display: "flex",
          flexDirection: "column-reverse",
          gap: "2",
        }),
        className
      )}
      {...props}
    />
  );
};

const DialogTitle: React.FC<ComponentProps<typeof DialogPrimitive.Title>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={clsx(css({ fontSize: "lg", fontWeight: "bold" }), className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
};

const DialogDescription: React.FC<
  ComponentProps<typeof DialogPrimitive.Description>
> = ({ className, children, ...props }) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={clsx(css({ fontSize: "sm", color: "retro.900" }), className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogPortal,
};
