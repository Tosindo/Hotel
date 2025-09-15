import { DoorOpen } from "lucide-react";
import { useComputedStore } from "../computedStore";
import { BigButton } from "../core/BigButton";
import { Tooltip } from "../core/Tooltip";
import { useHotelStore } from "../hotelStore";
import { formatNumber } from "../settingsStore";
import { flex } from "../../styled-system/patterns";

const CheckInGuestButton: React.FC = () => {
  const cleanRooms = useHotelStore((s) => s.cleanRooms);
  const totalRooms = useComputedStore((s) => s.totalRooms);

  return (
    <Tooltip content="Check in a guest to a clean room" side="bottom">
      <BigButton
        onClick={() => useHotelStore.getState().checkInGuest()}
        disabled={cleanRooms.lte(0)}
      >
        <div
          className={flex({
            width: "full",
            justifyContent: "center",
            fontSize: "2xl",
          })}
        >
          <DoorOpen />
        </div>
        Check In Guest ({formatNumber(cleanRooms)}/{formatNumber(totalRooms)})
      </BigButton>
    </Tooltip>
  );
};

export { CheckInGuestButton };
