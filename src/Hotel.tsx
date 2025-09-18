import { useEffect, useRef, useState } from "react";
import { css } from "../styled-system/css";
import { flex, hstack, vstack } from "../styled-system/patterns";
import { UPGRADES, useHotelStore } from "./hotelStore";
import { useComputedStore } from "./computedStore";
import { CleanRoomButton } from "./components/CleanRoomButton";
import { CheckInGuestButton } from "./components/CheckInGuestButton";
import { TopBar } from "./components/TopBar";
import { Purchasable } from "./components/Purchasable";
import { useShallow } from "zustand/shallow";
import Decimal from "break_infinity.js";
import { Progress } from "./core/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./core/Tabs";
import { Sprite } from "./core/Sprite";
import { ScrollArea } from "./core/ScrollArea";

const maxJuniors = new Decimal(10);

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

  const [cleanProgress, setCleanProgress] = useState(0);

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

  const {
    singleRoomPrice,
    doubleRoomPrice,
    tripleRoomPrice,
    quadRoomPrice,
    penthouseRoomPrice,
    receptionistPrice,
    cleanerPrice,
    buildingPrice,
    maxSingleRooms,
    maxDoubleRooms,
    maxTripleRooms,
    maxQuadRooms,
    maxPenthouseRooms,
    juniorReceptionistPrice,
    juniorCleanerPrice,
  } = useComputedStore(
    useShallow((s) => ({
      singleRoomPrice: s.singleRoomPrice,
      doubleRoomPrice: s.doubleRoomPrice,
      tripleRoomPrice: s.tripleRoomPrice,
      quadRoomPrice: s.quadRoomPrice,
      penthouseRoomPrice: s.penthouseRoomPrice,
      receptionistPrice: s.receptionistPrice,
      cleanerPrice: s.cleanerPrice,
      buildingPrice: s.buildingPrice,
      maxSingleRooms: s.maxSingleRooms,
      maxDoubleRooms: s.maxDoubleRooms,
      maxTripleRooms: s.maxTripleRooms,
      maxQuadRooms: s.maxQuadRooms,
      maxPenthouseRooms: s.maxPenthouseRooms,
      juniorReceptionistPrice: s.juniorReceptionistPrice,
      juniorCleanerPrice: s.juniorCleanerPrice,
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
    buildings,
    hiredJuniorReceptionists,
    hiredJuniorCleaners,
    isCleaning,
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
      buildings: s.buildings,
      hiredJuniorReceptionists: s.hiredJuniorReceptionists,
      hiredJuniorCleaners: s.hiredJuniorCleaners,
      isCleaning: s.cleaningCycleStartTime !== null,
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
      setCleanProgress(useHotelStore.getState().getCleaningProgress());

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
    <>
      <audio src="/click.wav" preload="auto" ref={buttonClickAudioRef} />
      <div
        ref={rootRef}
        className={css({
          display: "flex",
          position: "relative",
          background: "retro.400",
          width: "full",
          height: "full",
          overflow: "hidden",

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

          <div
            className={flex({
              width: "full",
              flexShrink: 0,
            })}
          >
            <div
              className={flex({
                zIndex: "1",
                color: "white",
                gap: "2",
                mixBlendMode: "hard-light",
                fontSize: "md",
                alignItems: "center",
                justifyContent: "center",
                width: "32",
                border: "retro-border",
                borderColor: "retro.800",
                borderTopWidth: "0",
                background: "retro.800",
              })}
            >
              <Sprite type="clock" size={16} />
              <span
                className={css({
                  fontWeight: "bold",
                })}
              >
                {dayProgress.time}
              </span>
            </div>
            <Progress
              value={dayProgress.progress}
              max={1}
              steps={40}
              css={{ borderTopWidth: 0 }}
            />
          </div>

          <div
            className={hstack({
              gap: "4",
              padding: "4",
              py: "16",
            })}
          >
            <CheckInGuestButton />
            <CleanRoomButton
              cleaningPercent={cleanProgress}
              isCleaning={isCleaning}
            />
          </div>
          <div
            className={hstack({
              width: "full",
              gap: "0",
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
              flexGrow: 1,
              minHeight: "0", // important for flexbox
            })}
          >
            <section
              className={vstack({
                gap: "0",
                height: "full",
                width: "full",
                md: {
                  width: "1/2",
                },
              })}
            >
              <Tabs defaultValue="rooms" className={css({ height: "full" })}>
                <TabsList>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="buildings">Buildings</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="rooms"
                  className={css({
                    maxH: "full",
                    overflow: "hidden",
                    display: "flex",
                    minHeight: "0",
                  })}
                >
                  <ScrollArea className={css({ maxH: "full", w: "full" })}>
                    <div
                      className={vstack({
                        width: "full",
                        gap: "0",
                      })}
                    >
                      <Purchasable
                        spriteType="singleRoom"
                        label="Fix single room"
                        description="A small room for a single guest."
                        cost={singleRoomPrice}
                        count={singleRooms}
                        maxCount={maxSingleRooms}
                        onPurchase={() =>
                          useHotelStore.getState().buyRoom("single")
                        }
                      />
                      <Purchasable
                        spriteType="doubleRoom"
                        label="Fix double room"
                        description="A comfortable room for two guests."
                        cost={doubleRoomPrice}
                        count={doubleRooms}
                        maxCount={maxDoubleRooms}
                        onPurchase={() =>
                          useHotelStore.getState().buyRoom("double")
                        }
                      />
                      <Purchasable
                        spriteType="tripleRoom"
                        label="Fix triple room"
                        description="A spacious room for three guests."
                        cost={tripleRoomPrice}
                        count={tripleRooms}
                        maxCount={maxTripleRooms}
                        onPurchase={() =>
                          useHotelStore.getState().buyRoom("triple")
                        }
                      />
                      <Purchasable
                        spriteType="quadRoom"
                        label="Fix quad room"
                        description="A large room for four guests."
                        cost={quadRoomPrice}
                        count={quadRooms}
                        maxCount={maxQuadRooms}
                        onPurchase={() =>
                          useHotelStore.getState().buyRoom("quad")
                        }
                      />
                      <Purchasable
                        spriteType="penthouseRoom"
                        label="Fix penthouse room"
                        description="A luxurious room for five or more guests."
                        cost={penthouseRoomPrice}
                        count={penthouseRooms}
                        maxCount={maxPenthouseRooms}
                        onPurchase={() =>
                          useHotelStore.getState().buyRoom("penthouse")
                        }
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="services">Not yet available :(</TabsContent>
                <TabsContent
                  value="buildings"
                  className={css({
                    maxH: "full",
                    overflow: "hidden",
                    display: "flex",
                    minHeight: "0",
                  })}
                >
                  <ScrollArea className={css({ maxH: "full", w: "full" })}>
                    <div
                      className={vstack({
                        width: "full",
                        gap: "0",
                      })}
                    >
                      <Purchasable
                        label="Buy adjacent building"
                        description="We need more space, let's buy the building next door!"
                        tooltipContent="Each building increases the total number of rooms you can possess."
                        cost={buildingPrice}
                        count={buildings}
                        onPurchase={() =>
                          useHotelStore.getState().buyBuilding()
                        }
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </section>

            <section
              className={vstack({
                gap: "0",
                width: "full",
                height: "full",
                md: {
                  width: "1/2",
                },
              })}
            >
              <Tabs defaultValue="staff" className={css({ height: "full" })}>
                <TabsList>
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                  <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="staff"
                  className={css({
                    maxH: "full",
                    overflow: "hidden",
                    display: "flex",
                    minHeight: "0",
                  })}
                >
                  <ScrollArea className={css({ maxH: "full", w: "full" })}>
                    <div
                      className={vstack({
                        width: "full",
                        gap: "0",
                      })}
                    >
                      <Purchasable
                        spriteType="juniorReceptionist"
                        label="Hire junior receptionist"
                        description="A good for nothing junior receptionist to check in guests for you, don't expect much."
                        cost={juniorReceptionistPrice}
                        count={hiredJuniorReceptionists}
                        maxCount={maxJuniors}
                        onPurchase={() =>
                          useHotelStore.getState().hireJuniorReceptionist()
                        }
                      />
                      <Purchasable
                        spriteType="juniorCleaner"
                        label="Hire junior cleaner"
                        description="A junior cleaner, you feel like the rooms are dirtyer when they leave, but the guests seem happy enough."
                        cost={juniorCleanerPrice}
                        count={hiredJuniorCleaners}
                        maxCount={maxJuniors}
                        onPurchase={() =>
                          useHotelStore.getState().hireJuniorCleaner()
                        }
                      />
                      <Purchasable
                        spriteType="receptionist"
                        label="Hire receptionist"
                        description="A friendly receptionist to check in guests."
                        cost={receptionistPrice}
                        count={hiredReceptionists}
                        onPurchase={() =>
                          useHotelStore.getState().hireReceptionist()
                        }
                      />
                      <Purchasable
                        spriteType="cleaner"
                        label="Hire cleaner"
                        description="A friendly cleaner to keep the rooms tidy."
                        cost={cleanerPrice}
                        count={hiredCleaners}
                        onPurchase={() =>
                          useHotelStore.getState().hireCleaner()
                        }
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent
                  value="upgrades"
                  className={css({
                    maxHeight: "full",
                    overflow: "hidden",
                    display: "flex",
                    minHeight: "0",
                  })}
                >
                  <ScrollArea className={css({ maxH: "full", w: "full" })}>
                    <div
                      className={vstack({
                        width: "full",
                        gap: "0",
                      })}
                    >
                      {UPGRADES.map((upgrade) => (
                        <Purchasable
                          key={upgrade.name}
                          label={upgrade.name}
                          description={upgrade.description}
                          cost={upgrade.cost}
                          onPurchase={() =>
                            useHotelStore.getState().buyUpgrade(upgrade)
                          }
                          purchased={purchasedUpgrades.includes(upgrade.key)}
                          tooltipContent={upgrade.detail}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export { Hotel };
