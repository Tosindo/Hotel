import { useEffect, useRef, useState } from "react";
import { css } from "../styled-system/css";
import { flex, hstack, vstack } from "../styled-system/patterns";
import { UPGRADES, useHotelStore } from "./hotelStore";
import { useComputedStore } from "./computedStore";
import { CleanRoomButton } from "./components/CleanRoomButton";
import { CheckInGuestButton } from "./components/CheckInGuestButton";
import { Bar } from "./core/Bar";
import { Clock } from "lucide-react";
import { TopBar } from "./components/TopBar";
import { Purchasable } from "./components/Purchasable";
import { useShallow } from "zustand/shallow";
import Decimal from "break_infinity.js";

declare global {
  interface Window {
    addMoney?: (amount: Decimal) => void; // For debugging purposes only
  }
}

const Hotel: React.FC = () => {
  const [dayProgress, setDayProgress] = useState<{
    progress: number;
    time: string;
  }>({
    progress: 0,
    time: "14:00",
  });
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const addMoney = useHotelStore((s) => s.addMoney); // For debugging purposes only

  useEffect(() => {
    window.addMoney = addMoney; // For debugging purposes only
    return () => {
      delete window.addMoney;
    };
  }, [addMoney]);

  const {
    singleRoomPrice,
    doubleRoomPrice,
    tripleRoomPrice,
    quadRoomPrice,
    penthouseRoomPrice,
    receptionistPrice,
    cleanerPrice,
  } = useComputedStore(
    useShallow((s) => ({
      singleRoomPrice: s.singleRoomPrice,
      doubleRoomPrice: s.doubleRoomPrice,
      tripleRoomPrice: s.tripleRoomPrice,
      quadRoomPrice: s.quadRoomPrice,
      penthouseRoomPrice: s.penthouseRoomPrice,
      receptionistPrice: s.receptionistPrice,
      cleanerPrice: s.cleanerPrice,
    }))
  );

  const {
    singleRooms,
    doubleRooms,
    tripleRooms,
    quadRooms,
    penthouseRooms,
    purchasedUpgrades,
    hiredReceptionists,
    hiredCleaners,
  } = useHotelStore(
    useShallow((s) => ({
      singleRooms: s.singleRooms,
      doubleRooms: s.doubleRooms,
      tripleRooms: s.tripleRooms,
      quadRooms: s.quadRooms,
      penthouseRooms: s.penthouseRooms,
      purchasedUpgrades: s.purchasedUpgrades,
      hiredReceptionists: s.hiredReceptionists,
      hiredCleaners: s.hiredCleaners,
    }))
  );

  const tick = useHotelStore((s) => s.tick);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;

      tick(deltaTime); // Your game logic gets called here

      setDayProgress(useHotelStore.getState().getDayProgress());

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
  }, [tick]);

  return (
    <div
      className={css({
        position: "relative",
        background: "retro.400",
        width: "full",
        height: "full",
      })}
    >
      <div
        className={vstack({
          gap: "0",
        })}
      >
        <TopBar />
        <Bar
          variant="light"
          className={css({
            height: "8",
            overflow: "hidden",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <div
            className={css({
              position: "absolute",
              top: "0",
              left: "0",
              height: "full",
              background: "retro.950",
              transition: "size",
              transitionDuration: "fast",
              transitionTimingFunction: "linear",
            })}
            style={{ width: `${dayProgress.progress * 100}%` }}
          />

          <div
            className={flex({
              zIndex: "1",
              color: "white",
              gap: "2",
              fontSize: "md",
              alignItems: "center",
            })}
          >
            <Clock />
            <span
              className={css({
                fontWeight: "bold",
              })}
            >
              {dayProgress.time}
            </span>
          </div>
        </Bar>
        <div
          className={hstack({
            gap: "4",
            padding: "4",
          })}
        >
          <CheckInGuestButton />
          <CleanRoomButton />
        </div>
        <div
          className={hstack({
            width: "full",
            gap: "4",
            padding: "4",
            alignItems: "flex-start",
          })}
        >
          <section className={vstack({ gap: "0", width: "full" })}>
            <Bar css={{ fontSize: "xl", fontWeight: "bold" }}>Store:</Bar>
            <Purchasable
              label="Fix single room"
              buttonLabel="Fix"
              tooltipContent="A small room for a single guest."
              cost={singleRoomPrice}
              count={singleRooms}
              onPurchase={() => useHotelStore.getState().buyRoom("single")}
            />
            <Purchasable
              label="Fix double room"
              buttonLabel="Fix"
              tooltipContent="A comfortable room for two guests."
              cost={doubleRoomPrice}
              count={doubleRooms}
              onPurchase={() => useHotelStore.getState().buyRoom("double")}
            />
            <Purchasable
              label="Fix triple room"
              buttonLabel="Fix"
              tooltipContent="A spacious room for three guests."
              cost={tripleRoomPrice}
              count={tripleRooms}
              onPurchase={() => useHotelStore.getState().buyRoom("triple")}
            />
            <Purchasable
              label="Fix quad room"
              buttonLabel="Fix"
              tooltipContent="A large room for four guests."
              cost={quadRoomPrice}
              count={quadRooms}
              onPurchase={() => useHotelStore.getState().buyRoom("quad")}
            />
            <Purchasable
              label="Fix penthouse room"
              buttonLabel="Fix"
              tooltipContent="A luxurious room for five or more guests."
              cost={penthouseRoomPrice}
              count={penthouseRooms}
              onPurchase={() => useHotelStore.getState().buyRoom("penthouse")}
            />
          </section>

          <section className={vstack({ gap: "0", width: "full" })}>
            <Bar css={{ fontSize: "xl", fontWeight: "bold" }}>Staff:</Bar>
            <Purchasable
              label="Hire receptionist"
              buttonLabel="Hire"
              tooltipContent="A friendly receptionist to check in guests."
              cost={receptionistPrice}
              count={hiredReceptionists}
              onPurchase={() => useHotelStore.getState().hireReceptionist()}
            />
            <Purchasable
              label="Hire cleaner"
              buttonLabel="Hire"
              tooltipContent="A friendly cleaner to keep the rooms tidy."
              cost={cleanerPrice}
              count={hiredCleaners}
              onPurchase={() => useHotelStore.getState().hireCleaner()}
            />
          </section>
          <section className={vstack({ gap: "0", width: "full" })}>
            <Bar css={{ fontSize: "xl", fontWeight: "bold" }}>Upgrades:</Bar>
            {UPGRADES.map((upgrade) => (
              <Purchasable
                key={upgrade.name}
                label={upgrade.name}
                buttonLabel="Upgrade"
                tooltipContent={upgrade.description}
                cost={upgrade.cost}
                onPurchase={() => useHotelStore.getState().buyUpgrade(upgrade)}
                purchased={purchasedUpgrades.includes(upgrade.key)}
              />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export { Hotel };
