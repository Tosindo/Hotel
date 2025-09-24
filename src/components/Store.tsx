import { css } from "../../styled-system/css";
import { hstack, vstack } from "../../styled-system/patterns";
import { ScrollArea } from "../core/ScrollArea";
import { Sprite } from "../core/Sprite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../core/Tabs";
import { UnitType } from "../engine/types";
import { useStorePaneInfo } from "../hooks/useHasAffordableUnit";
import { PurchasePane } from "./PurchasePane";

const Store: React.FC = () => {
  const { hasAffordableUnit: hasAffordableRoom, hasUnits: hasRooms } =
    useStorePaneInfo(UnitType.ROOM);
  const { hasAffordableUnit: hasAffordableBuilding, hasUnits: hasBuildings } =
    useStorePaneInfo(UnitType.BUILDING);
  const { hasAffordableUnit: hasAffordableService, hasUnits: hasServices } =
    useStorePaneInfo(UnitType.SERVICE);
  const { hasAffordableUnit: hasAffordableUpgrade, hasUnits: hasUpgrades } =
    useStorePaneInfo(UnitType.UPGRADE);
  const { hasAffordableUnit: hasAffordableStaff, hasUnits: hasStaff } =
    useStorePaneInfo(UnitType.STAFF);

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

        marginTop: "auto",
        height: "[400px]",
        maxHeight: "[50vh]",
      })}
    >
      <section
        className={vstack({
          gap: "0",
          height: "full",
          width: "full",
          md: {
            width: "2/3",
          },
        })}
      >
        <Tabs defaultValue="buildings" className={css({ height: "full" })}>
          <TabsList>
            {hasBuildings && (
              <TabsTrigger value="buildings">
                Buildings{" "}
                <Sprite
                  type="ball"
                  size={18}
                  style={{ opacity: hasAffordableBuilding ? 1 : 0 }}
                />
              </TabsTrigger>
            )}
            {hasRooms && (
              <TabsTrigger value="rooms">
                Rooms{" "}
                <Sprite
                  type="ball"
                  size={18}
                  style={{ opacity: hasAffordableRoom ? 1 : 0 }}
                />
              </TabsTrigger>
            )}
            {hasUpgrades && (
              <TabsTrigger value="upgrades">
                Upgrades{" "}
                <Sprite
                  type="ball"
                  size={18}
                  style={{ opacity: hasAffordableUpgrade ? 1 : 0 }}
                />
              </TabsTrigger>
            )}
            {hasStaff && (
              <TabsTrigger value="staff">
                Staff{" "}
                <Sprite
                  type="ball"
                  size={18}
                  style={{ opacity: hasAffordableStaff ? 1 : 0 }}
                />
              </TabsTrigger>
            )}
            {hasServices && (
              <TabsTrigger value="services">
                Services{" "}
                <Sprite
                  type="ball"
                  size={18}
                  style={{ opacity: hasAffordableService ? 1 : 0 }}
                />
              </TabsTrigger>
            )}
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
          <TabsContent value="services">
            <ScrollArea className={css({ maxH: "full", w: "full" })}>
              <PurchasePane type={UnitType.SERVICE} sortBy="baseCost" />
            </ScrollArea>
          </TabsContent>
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
            width: "1/3",
          },
        })}
      >
        <Tabs defaultValue="notableGuests" className={css({ height: "full" })}>
          <TabsList>
            <TabsTrigger value="notableGuests">Notable Guests</TabsTrigger>
          </TabsList>
          <TabsContent value="notableGuests"></TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export { Store };
