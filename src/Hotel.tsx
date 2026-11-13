import { useEffect, useRef } from "react";
import { css } from "../styled-system/css";
import { hstack, vstack } from "../styled-system/patterns";
import { useHotelStore } from "./hotelStore";
import { CleanRoomButton } from "./components/CleanRoomButton";
import { CheckInGuestButton } from "./components/CheckInGuestButton";
import { TopBar } from "./components/TopBar";
import Decimal from "break_infinity.js";
import DayProgress from "./components/DayProgress";
import { Store } from "./components/Store";
import { useEngine } from "./engine/EngineContext";
import { useAutosave } from "./hooks/useAutosave";
import { Cursor } from "./components/Cursor";
import { HandOutFlyersButton } from "./components/HandOutFlyersButton";

declare global {
  interface Window {
    addMoney?: (amount: Decimal) => void; // For debugging purposes only
  }
}

const Hotel: React.FC = () => {
  useAutosave();
  const engine = useEngine();
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonClickAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        !(e.target as HTMLElement).closest("button") ||
        !rootRef.current?.contains(e.target as Node) ||
        !buttonClickAudioRef.current
      ) {
        return;
      }

      // on any button click play click sound
      buttonClickAudioRef.current.currentTime = 0;
      buttonClickAudioRef.current.play().catch(() => {
        /* ignore */
      });
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const addMoney = useHotelStore((s) => s.addMoney); // For debugging purposes only

  useEffect(() => {
    window.addMoney = addMoney; // For debugging purposes only
    return () => {
      delete window.addMoney;
    };
  }, [addMoney]);

  const tick = useHotelStore((s) => s.tick);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;

      engine.tick(deltaTime);

      lastTimeRef.current = timestamp;
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    // Cleanup function to cancel the loop when the component unmounts
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [tick, engine]);

  return (
    <>
      <audio
        src={`${import.meta.env.BASE_URL}click.wav`}
        preload="auto"
        ref={buttonClickAudioRef}
      />
      <Cursor />
      <div
        ref={rootRef}
        className={css({
          display: "flex",
          position: "relative",
          background: "retro.400",
          width: "full",
          height: "full",
          overflow: "hidden",
          cursor: "[none !important]",

          _after: {
            content: '" "',
            display: "block",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            height: "[2px]",
            background: "[rgba(0, 0, 0, 0.2)]",
            zIndex: 100,
            pointerEvents: "none",
            animation: "bottomToTop",
          },

          _before: {
            content: '" "',
            display: "block",
            position: "fixed",
            top: "[-100vh]",
            left: "0",
            right: "0",
            height: "[200vh]",
            background:
              "[linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))]",
            zIndex: 100,
            backgroundSize: "100% 2px, 3px 100%",
            pointerEvents: "none",
            animation: "bottomToTop",
          },
        })}
      >
        <div
          className={vstack({
            gap: "0",
            flexGrow: 1,
          })}
        >
          <TopBar />
          <DayProgress />

          <div
            className={hstack({
              gap: "4",
              padding: "4",
              py: "16",
            })}
          >
            <HandOutFlyersButton />
            <CheckInGuestButton />
            <CleanRoomButton />
          </div>

          <Store />
        </div>
      </div>
    </>
  );
};

export { Hotel };
