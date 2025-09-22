import { css } from "../../styled-system/css";
import { hstack, vstack } from "../../styled-system/patterns";
import { ScrollArea } from "../core/ScrollArea";
import { Sprite } from "../core/Sprite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../core/Tabs";
import { UnitType } from "../engine/types";
import { useHasAffordableUnit } from "../hooks/useHasAffordableUnit";
import { PurchasePane } from "./PurchasePane";

const Store: React.FC = () => {
  const hasAfordableRoom = useHasAffordableUnit(UnitType.ROOM);
  const hasAfordableBuilding = useHasAffordableUnit(UnitType.BUILDING);
  const hasAfordableService = useHasAffordableUnit(UnitType.SERVICE);
  const hasAfordableUpgrade = useHasAffordableUnit(UnitType.UPGRADE);
  const hasAfordableStaff = useHasAffordableUnit(UnitType.STAFF);

  return (
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
            <TabsTrigger value="rooms">
              Rooms {hasAfordableRoom && <Sprite type="ball" size={12} />}
            </TabsTrigger>
            <TabsTrigger value="services">
              Services {hasAfordableService && <Sprite type="ball" size={12} />}
            </TabsTrigger>
            <TabsTrigger value="buildings">
              Buildings{" "}
              {hasAfordableBuilding && <Sprite type="ball" size={12} />}
            </TabsTrigger>
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
              <PurchasePane type={UnitType.ROOM} sortBy="baseCost" />
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
              <PurchasePane type={UnitType.BUILDING} sortBy="baseCost" />
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
        <Tabs defaultValue="upgrades" className={css({ height: "full" })}>
          <TabsList>
            <TabsTrigger value="upgrades">
              Upgrades {hasAfordableUpgrade && <Sprite type="ball" size={12} />}
            </TabsTrigger>
            <TabsTrigger value="staff">
              Staff {hasAfordableStaff && <Sprite type="ball" size={12} />}
            </TabsTrigger>
          </TabsList>
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
              <PurchasePane type={UnitType.UPGRADE} sortBy="cost" />
            </ScrollArea>
          </TabsContent>
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
                <PurchasePane type={UnitType.STAFF} sortBy="baseCost" />

                {/* <Purchasable
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
                        /> */}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export { Store };
