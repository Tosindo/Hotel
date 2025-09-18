import { useComputedStore } from "../computedStore";
import { BigButton } from "../core/BigButton";
import { Tooltip } from "../core/Tooltip";
import { useHotelStore } from "../hotelStore";
import { formatNumber } from "../settingsStore";
import { Sprite } from "../core/Sprite";

const CheckInGuestButton: React.FC = () => {
  const cleanRooms = useHotelStore((s) => s.cleanRooms);
  const totalRooms = useComputedStore((s) => s.totalRooms);

  return (
    <Tooltip content="Check in a guest to a clean room" side="bottom">
      <BigButton
        onClick={() => useHotelStore.getState().checkInGuest()}
        disabled={cleanRooms.lte(0)}
      >
        <Sprite type="checkIn" size={48} />
        Check In Guest ({formatNumber(cleanRooms)}/{formatNumber(totalRooms)})
      </BigButton>
    </Tooltip>
  );
};

export { CheckInGuestButton };
