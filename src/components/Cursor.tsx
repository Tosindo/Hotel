import { useEffect, useRef, useState } from "react";
import { css } from "../../styled-system/css";
import { Sprite } from "../core/Sprite";
import { throttle } from "../utils/throttle";
import type { SpriteType } from "../utils/stringToSprite";

export type CursorType =
  | "default"
  | "pointer"
  | "wait"
  | "grab"
  | "grabbing"
  | "cart"
  | "broom"
  | "broomAnim"
  | string
  | undefined;

const toCursorSpriteType = (type: CursorType): SpriteType => {
  switch (type) {
    case "default":
      return "cursor";
    case "pointer":
      return "cursorPointer";
    case "wait":
      return "cursorWait";
    case "grab":
      return "cursorGrab";
    case "grabbing":
      return "cursorGrabbing";
    case "cart":
      return "cursorCart";
    case "broom":
      return "cursorBroom";
    case "broomAnim":
      return "cursorlessBroom";
    default:
      return "cursor";
  }
};

const Cursor: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [pointerSprite, setPointerSprite] = useState<SpriteType>("cursor");
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let yOffset = 0;
    let xOffset = 0;

    const updatePosition = (x: number, y: number) => {
      ref.current?.animate(
        {
          transform: `translate(${x + xOffset}px, ${y + yOffset}px)`,
        },
        { duration: 100, fill: "forwards", easing: "ease-out" }
      );
    };

    const checkAndSetCursor = (x: number, y: number) => {
      const elementsBelow = document.elementsFromPoint(x, y);
      if (elementsBelow.length === 0) return;

      const pointerType = toCursorSpriteType(
        elementsBelow
          .find((el) => el.hasAttribute("data-cursor"))
          ?.getAttribute("data-cursor") ??
          getComputedStyle(elementsBelow[0]).getPropertyValue("--cursor") ??
          "default"
      );

      setPointerSprite(pointerType);
    };

    const onPointerMove = throttle((e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY);
      checkAndSetCursor(e.clientX, e.clientY);
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }, 16);

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;

      xOffset = 1;
      yOffset = 2;
      updatePosition(e.clientX, e.clientY + yOffset);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button !== 0) return;

      xOffset = 0;
      yOffset = 0;
      updatePosition(e.clientX, e.clientY);
    };

    const observer = new MutationObserver(() => {
      // When a mutation occurs, re-check the cursor at its last known position
      checkAndSetCursor(lastPosition.current.x, lastPosition.current.y);
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-cursor", "class", "style", "disabled"],
    });

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={css({
        pointerEvents: "none",
        color: "retro.950",
        position: "fixed",
        top: "-3",
        left: "-4",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "[none]",
      })}
    >
      <Sprite
        className={css({
          animation:
            pointerSprite === "cursorlessBroom"
              ? "broomCursorAnimation"
              : "[none]",
        })}
        type={pointerSprite}
        size={64}
      />
    </div>
  );
};

export { Cursor };
