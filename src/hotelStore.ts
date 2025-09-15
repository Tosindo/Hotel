import Decimal from "break_infinity.js";
import { create } from "zustand";
import { useComputedStore } from "./computedStore";
import dayjs from "dayjs";

const GUEST_TIERS = {
  single: { value: new Decimal(0.1) },
  double: { value: new Decimal(0.5) },
  triple: { value: new Decimal(2) },
  quad: { value: new Decimal(10) },
  penthouse: { value: new Decimal(50) },
};

const RECEPTIONIST_BASE_COST = new Decimal(20);
const CLEANER_BASE_COST = new Decimal(30);

const RECEPTIONIST_BASE_CHECKIN_RATE = new Decimal(0.4); // guests per second
const CLEANER_BASE_CLEANING_RATE = new Decimal(0.25); // rooms per second

const BASE_CLEAN_ROOM_DURATION = 3000; // in milliseconds

enum UpgradeType {
  ImproveCleaningSpeed = "ImproveCleaningSpeed",
  SingleRoomValue = "SingleRoomValue",
  DoubleRoomValue = "DoubleRoomValue",
  TripleRoomValue = "TripleRoomValue",
  QuadRoomValue = "QuadRoomValue",
  PenthouseRoomValue = "PenthouseRoomValue",
}

interface BaseUpgrade {
  key: string;
  name: string;
  description: string;
  cost: Decimal;
}

interface ImproveCleaningSpeedUpgrade extends BaseUpgrade {
  type: UpgradeType.ImproveCleaningSpeed;
  apply: (duration: number) => number;
  applyCleaners?: (rate: Decimal) => Decimal;
}

interface IncreaseRoomValueUpgrade extends BaseUpgrade {
  type:
    | UpgradeType.SingleRoomValue
    | UpgradeType.DoubleRoomValue
    | UpgradeType.TripleRoomValue
    | UpgradeType.QuadRoomValue
    | UpgradeType.PenthouseRoomValue;
  apply: (value: Decimal) => Decimal;
}

type Upgrade = ImproveCleaningSpeedUpgrade | IncreaseRoomValueUpgrade;

export const UPGRADES: Upgrade[] = [
  {
    key: "better_cleaning_supplies",
    type: UpgradeType.ImproveCleaningSpeed,
    name: "Better cleaning supplies",
    description:
      "With better cleaning supplies, you can clean rooms half a second faster.",
    cost: new Decimal(15),
    apply: (duration: number) => duration - 500,
    applyCleaners: (rate: Decimal) => rate.mul(1.1),
  },
  {
    key: "lonely_flower",
    type: UpgradeType.SingleRoomValue,
    name: "Lonely flower",
    description:
      "Adds a single flower to each single room, increasing its value by 20%.",
    cost: new Decimal(25),
    apply: (value: Decimal) => value.mul(1.2),
  },
  {
    key: "cleaning_sensitive_ear_pieces",
    type: UpgradeType.ImproveCleaningSpeed,
    name: "Cleaning-sensitive ear pieces",
    description:
      "These ear pieces helps you clean faster by playing motivational sounds based on the current room's cleanliness.",
    cost: new Decimal(40),
    apply: (duration: number) => duration / 1.35,
    applyCleaners: (rate: Decimal) => rate.mul(1.25),
  },
];

interface HotelStore {
  money: Decimal;
  cleanRooms: Decimal;
  occupiedRooms: Decimal;
  dirtyRooms: Decimal;

  singleRooms: Decimal;
  doubleRooms: Decimal;
  tripleRooms: Decimal;
  quadRooms: Decimal;
  penthouseRooms: Decimal;

  hiredReceptionists: Decimal;
  hiredCleaners: Decimal;

  purchasedUpgrades: string[];

  checkoutCycleDuration: number; // in seconds
  checkoutCycleStartTime: number;

  pendingCheckins: Decimal;
  pendingCleanings: Decimal;

  buyRoom: (
    type: "single" | "double" | "triple" | "quad" | "penthouse"
  ) => void;
  buyUpgrade: (upgrade: Upgrade) => void;
  hireReceptionist: () => void;
  hireCleaner: () => void;
  checkInGuest: () => void;
  cleanRoom: () => void;
  dirtyRoom: () => void;
  tick: (deltaTime: number) => void;
  getDayProgress: () => {
    progress: number;
    time: string;
  };

  addMoney?: (amount: Decimal) => void; // For debugging purposes only
}

const useHotelStore = create<HotelStore>()((set, get) => ({
  money: new Decimal(0),
  cleanRooms: new Decimal(0),
  occupiedRooms: new Decimal(0),
  dirtyRooms: new Decimal(0),

  singleRooms: new Decimal(0),
  doubleRooms: new Decimal(0),
  tripleRooms: new Decimal(0),
  quadRooms: new Decimal(0),
  penthouseRooms: new Decimal(0),

  hiredReceptionists: new Decimal(0),
  hiredCleaners: new Decimal(0),

  checkedInGuests: new Decimal(0),
  checkoutCycleDuration: 30, // 30 seconds
  checkoutCycleStartTime: Date.now(),

  pendingCheckins: new Decimal(0),
  pendingCleanings: new Decimal(0),

  purchasedUpgrades: [],

  buyRoom: (
    type: "single" | "double" | "triple" | "quad" | "penthouse" = "single"
  ) => {
    const roomCost = useComputedStore.getState()[`${type}RoomPrice`];

    if (get().money.gte(roomCost)) {
      set((state) => ({
        money: state.money.sub(roomCost),
        cleanRooms: state.cleanRooms.add(1),
        [`${type}Rooms`]: state[`${type}Rooms`].add(1) as Decimal,
      }));
    }
  },
  buyUpgrade: (upgrade: Upgrade) => {
    if (get().money.gte(upgrade.cost)) {
      set((state) => ({
        money: state.money.sub(upgrade.cost),
        purchasedUpgrades: [...state.purchasedUpgrades, upgrade.key],
      }));
    }
  },
  hireReceptionist: () => {
    const cost = useComputedStore.getState().receptionistPrice;
    if (get().money.gte(cost)) {
      set((state) => ({
        money: state.money.sub(cost),
        hiredReceptionists: state.hiredReceptionists.add(1),
      }));
    }
  },
  hireCleaner: () => {
    const cost = useComputedStore.getState().cleanerPrice;
    if (get().money.gte(cost)) {
      set((state) => ({
        money: state.money.sub(cost),
        hiredCleaners: state.hiredCleaners.add(1),
      }));
    }
  },
  checkInGuest: () => {
    if (get().cleanRooms.gte(1)) {
      set((state) => ({
        cleanRooms: state.cleanRooms.sub(1),
        occupiedRooms: state.occupiedRooms.add(1),
      }));
    }
  },
  cleanRoom: () => {
    if (get().dirtyRooms.gte(1)) {
      set((state) => ({
        dirtyRooms: state.dirtyRooms.sub(1),
        cleanRooms: state.cleanRooms.add(1),
      }));
    }
  },
  dirtyRoom: () => {
    if (get().cleanRooms.gte(1)) {
      set((state) => ({
        cleanRooms: state.cleanRooms.sub(1),
        dirtyRooms: state.dirtyRooms.add(1),
      }));
    }
  },
  tick: (deltaTime: number) => {
    const state = get();
    const currentTime = Date.now();
    const elapsedTime = (currentTime - state.checkoutCycleStartTime) / 1000; // in seconds

    // If checkoutCycleDuration has passed, all guests become dirty rooms
    if (elapsedTime >= state.checkoutCycleDuration) {
      set((s) => ({
        dirtyRooms: s.dirtyRooms.add(s.occupiedRooms),
        occupiedRooms: new Decimal(0),
        checkoutCycleStartTime: currentTime,
      }));
      return;
    }

    // Check in guests based on the number of receptionists and their check-in rate
    // Increments pendingCheckins until it's a whole number, if it is a whole number, remove that many cleanRooms and add to occupiedRooms
    // Will not process if 0 cleanRooms available
    const receptionistCheckinRate =
      useComputedStore.getState().receptionistCheckinRate;
    if (state.cleanRooms.gt(0) && !receptionistCheckinRate.eq(0)) {
      const newPendingCheckins = state.pendingCheckins.add(
        receptionistCheckinRate.mul(deltaTime)
      );
      const wholeCheckins = newPendingCheckins.floor();
      if (wholeCheckins.gt(0)) {
        const actualCheckins = Decimal.min(wholeCheckins, state.cleanRooms);
        set((s) => ({
          cleanRooms: s.cleanRooms.sub(actualCheckins),
          occupiedRooms: s.occupiedRooms.add(actualCheckins),
          pendingCheckins: newPendingCheckins.sub(actualCheckins),
        }));
      } else {
        set(() => ({
          pendingCheckins: newPendingCheckins,
        }));
      }
    }

    // Clean rooms based on the number of cleaners and their cleaning rate
    // Increments pendingCleanings until it's a whole number, if it is a whole number, remove that many dirtyRooms and add to cleanRooms
    // Will not process if 0 dirtyRooms available
    const cleanerCleaningRate = useComputedStore.getState().cleanerCleaningRate;
    if (state.dirtyRooms.gt(0) && !cleanerCleaningRate.eq(0)) {
      const newPendingCleanings = state.pendingCleanings.add(
        cleanerCleaningRate.mul(deltaTime)
      );
      const wholeCleanings = newPendingCleanings.floor();
      if (wholeCleanings.gt(0)) {
        const actualCleanings = Decimal.min(wholeCleanings, state.dirtyRooms);
        set((s) => ({
          dirtyRooms: s.dirtyRooms.sub(actualCleanings),
          cleanRooms: s.cleanRooms.add(actualCleanings),
          pendingCleanings: newPendingCleanings.sub(actualCleanings),
        }));
      } else {
        set(() => ({
          pendingCleanings: newPendingCleanings,
        }));
      }
    }

    const incomePerSecond = useComputedStore.getState().incomePerSecond;
    const incomeThisTick = incomePerSecond.mul(deltaTime);
    set((s) => ({
      money: s.money.add(incomeThisTick),
    }));
  },
  getDayProgress: () => {
    const state = get();
    const currentTime = Date.now();
    const elapsedTime = (currentTime - state.checkoutCycleStartTime) / 1000;

    const time = dayjs()
      .startOf("day")
      .add(14, "hours")
      .add(Math.min(elapsedTime / state.checkoutCycleDuration, 1) * 24, "hours")
      .format("HH:mm");
    const progress = Math.min(elapsedTime / state.checkoutCycleDuration, 1);

    return { progress, time };
  },

  addMoney: (amount: Decimal) => {
    set((state) => ({
      money: state.money.add(amount),
    }));
  },
}));

useHotelStore.subscribe((state) => {
  const {
    singleRooms,
    doubleRooms,
    tripleRooms,
    quadRooms,
    penthouseRooms,
    occupiedRooms,
  } = state;
  const totalRooms = singleRooms
    .add(doubleRooms)
    .add(tripleRooms)
    .add(quadRooms)
    .add(penthouseRooms);

  const singleRoomPrice = singleRooms.eq(0)
    ? new Decimal(0)
    : new Decimal(5).mul(new Decimal(1.1).pow(singleRooms.sub(1)));

  const doubleRoomPrice = new Decimal(10).mul(
    new Decimal(1.1).pow(doubleRooms.sub(1))
  );

  const tripleRoomPrice = new Decimal(50).mul(
    new Decimal(1.1).pow(tripleRooms.sub(1))
  );

  const quadRoomPrice = new Decimal(100).mul(
    new Decimal(1.1).pow(quadRooms.sub(1))
  );

  const penthouseRoomPrice = new Decimal(500).mul(
    new Decimal(1.1).pow(penthouseRooms.sub(1))
  );

  const receptionistPrice = RECEPTIONIST_BASE_COST.mul(
    new Decimal(1.15).pow(state.hiredReceptionists)
  );
  const cleanerPrice = CLEANER_BASE_COST.mul(
    new Decimal(1.15).pow(state.hiredCleaners)
  );

  let cleanRoomDuration = BASE_CLEAN_ROOM_DURATION;

  let singleRoomPotentialIncome = GUEST_TIERS.single.value;
  let doubleRoomPotentialIncome = GUEST_TIERS.double.value;
  let tripleRoomPotentialIncome = GUEST_TIERS.triple.value;
  let quadRoomPotentialIncome = GUEST_TIERS.quad.value;
  let penthouseRoomPotentialIncome = GUEST_TIERS.penthouse.value;

  const receptionistCheckinRate = RECEPTIONIST_BASE_CHECKIN_RATE.mul(
    state.hiredReceptionists
  );

  let cleanerCleaningRate = CLEANER_BASE_CLEANING_RATE.mul(state.hiredCleaners);

  state.purchasedUpgrades.forEach((key) => {
    const upgrade = UPGRADES.find((u) => u.key === key);
    if (!upgrade) return;

    switch (upgrade.type) {
      case UpgradeType.ImproveCleaningSpeed:
        cleanRoomDuration = upgrade.apply(cleanRoomDuration);
        if (upgrade.applyCleaners) {
          cleanerCleaningRate = upgrade.applyCleaners(cleanerCleaningRate);
        }
        break;
      case UpgradeType.SingleRoomValue:
        singleRoomPotentialIncome = upgrade.apply(singleRoomPotentialIncome);
        break;
      case UpgradeType.DoubleRoomValue:
        doubleRoomPotentialIncome = upgrade.apply(doubleRoomPotentialIncome);
        break;
      case UpgradeType.TripleRoomValue:
        tripleRoomPotentialIncome = upgrade.apply(tripleRoomPotentialIncome);
        break;
      case UpgradeType.QuadRoomValue:
        quadRoomPotentialIncome = upgrade.apply(quadRoomPotentialIncome);
        break;
      case UpgradeType.PenthouseRoomValue:
        penthouseRoomPotentialIncome = upgrade.apply(
          penthouseRoomPotentialIncome
        );
        break;
    }
  });

  const potentialIncome = singleRoomPotentialIncome
    .mul(singleRooms)
    .add(doubleRoomPotentialIncome.mul(doubleRooms))
    .add(tripleRoomPotentialIncome.mul(tripleRooms))
    .add(quadRoomPotentialIncome.mul(quadRooms))
    .add(penthouseRoomPotentialIncome.mul(penthouseRooms));

  let incomePerGuest = new Decimal(0);
  if (totalRooms.gt(0)) {
    incomePerGuest = potentialIncome.div(totalRooms);
  }

  const incomePerSecond = incomePerGuest.mul(occupiedRooms);

  useComputedStore.setState({
    totalRooms,
    singleRoomPrice,
    doubleRoomPrice,
    tripleRoomPrice,
    quadRoomPrice,
    penthouseRoomPrice,
    incomePerSecond,
    cleanRoomDuration,
    receptionistPrice,
    cleanerPrice,
    receptionistCheckinRate,
    cleanerCleaningRate,
  });
});

export { useHotelStore };
