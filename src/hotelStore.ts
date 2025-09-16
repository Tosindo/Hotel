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

const BASE_PRICE_TIERS = {
  single: new Decimal(5),
  double: new Decimal(10),
  triple: new Decimal(50),
  quad: new Decimal(100),
  penthouse: new Decimal(500),
};

export const ROOMS_PER_BUILDING = {
  single: new Decimal(10),
  double: new Decimal(7),
  triple: new Decimal(5),
  quad: new Decimal(3),
  penthouse: new Decimal(1),
};

const BASE_BUILDING_PRICE = new Decimal(1000);

const RECEPTIONIST_BASE_COST = new Decimal(20);
const CLEANER_BASE_COST = new Decimal(30);

const RECEPTIONIST_BASE_CHECKIN_RATE = new Decimal(0.4); // guests per second
const CLEANER_BASE_CLEANING_RATE = new Decimal(0.25); // rooms per second

const BASE_CLEAN_ROOM_DURATION = 3000; // in milliseconds

enum UpgradeType {
  ImproveCleaningSpeed = "ImproveCleaningSpeed",
  RoomValue = "RoomValue",
  BuildingDiscount = "BuildingDiscount",
  RoomDiscount = "RoomDiscount",
  StaffDiscount = "StaffDiscount",
  StaffEfficiency = "StaffEfficiency",
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
}

interface IncreaseRoomValueUpgrade extends BaseUpgrade {
  type: UpgradeType.RoomValue;
  apply: (value: Decimal) => Decimal;
  roomType: "single" | "double" | "triple" | "quad" | "penthouse";
}

interface BuildingDiscountUpgrade extends BaseUpgrade {
  type: UpgradeType.BuildingDiscount;
  apply: (cost: Decimal) => Decimal;
}

interface RoomDiscountUpgrade extends BaseUpgrade {
  type: UpgradeType.RoomDiscount;
  apply: (cost: Decimal) => Decimal;
  roomType: "single" | "double" | "triple" | "quad" | "penthouse";
}

interface StaffDiscountUpgrade extends BaseUpgrade {
  type: UpgradeType.StaffDiscount;
  apply: (cost: Decimal) => Decimal;
  staffType: "receptionist" | "cleaner";
}

interface StaffEfficiencyUpgrade extends BaseUpgrade {
  type: UpgradeType.StaffEfficiency;
  apply: (rate: Decimal) => Decimal;
  staffType: "receptionist" | "cleaner";
}

type Upgrade =
  | ImproveCleaningSpeedUpgrade
  | IncreaseRoomValueUpgrade
  | BuildingDiscountUpgrade
  | RoomDiscountUpgrade
  | StaffDiscountUpgrade
  | StaffEfficiencyUpgrade;

export const UPGRADES: Upgrade[] = [
  {
    key: "better_cleaning_supplies",
    type: UpgradeType.ImproveCleaningSpeed,
    name: "Better cleaning supplies",
    description:
      "With better cleaning supplies, you can clean rooms half a second faster.",
    cost: new Decimal(15),
    apply: (duration: number) => duration - 500,
  },
  {
    key: "lonely_flower",
    type: UpgradeType.RoomValue,
    name: "Lonely flower",
    description:
      "Adds a single flower to each single room, increasing its value by 20%.",
    cost: new Decimal(25),
    apply: (value: Decimal) => value.mul(1.2),
    roomType: "single",
  },
  {
    key: "cleaning_sensitive_ear_pieces",
    type: UpgradeType.ImproveCleaningSpeed,
    name: "Cleaning-sensitive ear pieces",
    description:
      "These ear pieces helps you clean faster by playing motivational sounds based on the current room's cleanliness.",
    cost: new Decimal(40),
    apply: (duration: number) => duration / 1.35,
  },
  {
    key: "espresso_machine",
    type: UpgradeType.StaffEfficiency,
    staffType: "receptionist",
    name: "Espresso Machine",
    description:
      "Wired directly to the mains for extra kick. Receptionists check in guests 25% faster.",
    cost: new Decimal(80),
    apply: (rate: Decimal) => rate.mul(1.25),
  },
  {
    key: "modern_interior",
    type: UpgradeType.RoomValue,
    name: "Modern interior",
    description:
      "A modern interior design for double rooms, increasing their value by 25%.",
    cost: new Decimal(100),
    apply: (value: Decimal) => value.mul(1.25),
    roomType: "double",
  },
  {
    key: "caffeinated_mop_water",
    type: UpgradeType.StaffEfficiency,
    staffType: "cleaner",
    name: "Caffeinated Mop Water",
    description:
      "Cleaners absorb caffeine through their skin, allowing them to clean 25% faster.",
    cost: new Decimal(120),
    apply: (rate: Decimal) => rate.mul(1.25),
  },
  {
    key: "dubious_estate_agent",
    type: UpgradeType.BuildingDiscount,
    name: "Dubious estate agent",
    description:
      "A dubious fellow who claims he can get you a discount on buildings. Somehow, it works. Buildings are 10% cheaper.",
    cost: new Decimal(200),
    apply: (cost: Decimal) => cost.mul(0.9),
  },
  {
    key: "luxury_penthouse_with_a_pool",
    type: UpgradeType.RoomValue,
    name: "Luxury penthouse, with a pool?",
    description:
      "Somehow you manage to add a pool to all your penthouse rooms, increasing their value by 30%.",
    cost: new Decimal(500),
    apply: (value: Decimal) => value.mul(1.3),
    roomType: "penthouse",
  },
  {
    key: "crazy_guy_with_an_hammer",
    type: UpgradeType.RoomDiscount,
    name: "Crazy guy with an hammer",
    description:
      "A crazy guy that hammers rooms into shape, refuses to work on anything other than single rooms due to never having had a relationship. (10% off single rooms)",
    cost: new Decimal(750),
    apply: (cost: Decimal) => cost.mul(0.9),
    roomType: "single",
  },
  {
    key: "unpaid_interns",
    type: UpgradeType.StaffDiscount,
    staffType: "receptionist",
    name: "Unpaid Intern Program",
    description:
      "Gain valuable 'exposure' by hiring receptionists for 20% less.",
    cost: new Decimal(1500),
    apply: (cost: Decimal) => cost.mul(0.8),
  },
  {
    key: "less_haunted_mirror",
    type: UpgradeType.RoomValue,
    roomType: "single",
    name: "Slightly Less Haunted Mirror",
    description:
      "The reflection only sometimes whispers back now. Single room value +50%.",
    cost: new Decimal(2000),
    apply: (value: Decimal) => value.mul(1.5),
  },
  {
    key: "hypnotic_seminar",
    type: UpgradeType.StaffEfficiency,
    staffType: "receptionist",
    name: "Hypnotic Training Seminar",
    description:
      "A mandatory 8-hour seminar with a suspiciously swinging pocket watch. Receptionists are now twice as efficient.",
    cost: new Decimal(5000),
    apply: (rate: Decimal) => rate.mul(2),
  },
  {
    key: "seance_kit",
    type: UpgradeType.RoomValue,
    roomType: "triple",
    name: "Complimentary Séance Kit",
    description: "Great for group activities! Triple room value +40%.",
    cost: new Decimal(8000),
    apply: (value: Decimal) => value.mul(1.4),
  },
  {
    key: "architectural_loophole",
    type: UpgradeType.BuildingDiscount,
    name: "Architectural Loophole",
    description:
      "By classifying new buildings as 'performance art installations', you save 15% on construction costs.",
    cost: new Decimal(10000),
    apply: (cost: Decimal) => cost.mul(0.85),
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

  buildings: Decimal;

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
  buyBuilding: () => void;
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

  buildings: new Decimal(0),

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
    const maxRooms =
      useComputedStore.getState()[
        `max${type.charAt(0).toUpperCase() + type.slice(1)}Rooms` as `max${Capitalize<typeof type>}Rooms`
      ];
    const currentRooms = get()[`${type}Rooms`];
    if (currentRooms.gte(maxRooms)) {
      return; // Cannot buy more rooms than the maximum allowed
    }

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
  buyBuilding: () => {
    const cost = useComputedStore.getState().buildingPrice;
    if (get().money.gte(cost)) {
      set((state) => ({
        money: state.money.sub(cost),
        buildings: state.buildings.add(1),
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

  let singleRoomPrice = singleRooms.eq(0)
    ? new Decimal(0)
    : BASE_PRICE_TIERS.single.mul(new Decimal(1.1).pow(singleRooms.sub(1)));

  let doubleRoomPrice = BASE_PRICE_TIERS.double.mul(
    new Decimal(1.1).pow(doubleRooms.sub(1))
  );

  let tripleRoomPrice = BASE_PRICE_TIERS.triple.mul(
    new Decimal(1.1).pow(tripleRooms.sub(1))
  );

  let quadRoomPrice = BASE_PRICE_TIERS.quad.mul(
    new Decimal(1.1).pow(quadRooms.sub(1))
  );

  let penthouseRoomPrice = BASE_PRICE_TIERS.penthouse.mul(
    new Decimal(1.1).pow(penthouseRooms.sub(1))
  );

  let receptionistPrice = RECEPTIONIST_BASE_COST.mul(
    new Decimal(1.15).pow(state.hiredReceptionists)
  );

  let cleanerPrice = CLEANER_BASE_COST.mul(
    new Decimal(1.15).pow(state.hiredCleaners)
  );

  let buildingPrice = BASE_BUILDING_PRICE.mul(
    new Decimal(1.2).pow(state.buildings)
  );

  let cleanRoomDuration = BASE_CLEAN_ROOM_DURATION;

  let singleRoomPotentialIncome = GUEST_TIERS.single.value;
  let doubleRoomPotentialIncome = GUEST_TIERS.double.value;
  let tripleRoomPotentialIncome = GUEST_TIERS.triple.value;
  let quadRoomPotentialIncome = GUEST_TIERS.quad.value;
  let penthouseRoomPotentialIncome = GUEST_TIERS.penthouse.value;

  let receptionistCheckinRate = RECEPTIONIST_BASE_CHECKIN_RATE.mul(
    state.hiredReceptionists
  );

  let cleanerCleaningRate = CLEANER_BASE_CLEANING_RATE.mul(state.hiredCleaners);

  state.purchasedUpgrades.forEach((key) => {
    const upgrade = UPGRADES.find((u) => u.key === key);
    if (!upgrade) return;

    switch (upgrade.type) {
      case UpgradeType.ImproveCleaningSpeed:
        cleanRoomDuration = upgrade.apply(cleanRoomDuration);
        break;
      case UpgradeType.RoomValue:
        switch (upgrade.roomType) {
          case "single":
            singleRoomPotentialIncome = upgrade.apply(
              singleRoomPotentialIncome
            );
            break;
          case "double":
            doubleRoomPotentialIncome = upgrade.apply(
              doubleRoomPotentialIncome
            );
            break;
          case "triple":
            tripleRoomPotentialIncome = upgrade.apply(
              tripleRoomPotentialIncome
            );
            break;
          case "quad":
            quadRoomPotentialIncome = upgrade.apply(quadRoomPotentialIncome);
            break;
          case "penthouse":
            penthouseRoomPotentialIncome = upgrade.apply(
              penthouseRoomPotentialIncome
            );
            break;
        }
        break;
      case UpgradeType.BuildingDiscount:
        buildingPrice = upgrade.apply(buildingPrice);
        break;
      case UpgradeType.RoomDiscount:
        switch (upgrade.roomType) {
          case "single":
            singleRoomPrice = upgrade.apply(singleRoomPrice);
            break;
          case "double":
            doubleRoomPrice = upgrade.apply(doubleRoomPrice);
            break;
          case "triple":
            tripleRoomPrice = upgrade.apply(tripleRoomPrice);
            break;
          case "quad":
            quadRoomPrice = upgrade.apply(quadRoomPrice);
            break;
          case "penthouse":
            penthouseRoomPrice = upgrade.apply(penthouseRoomPrice);
            break;
        }
        break;
      case UpgradeType.StaffDiscount:
        switch (upgrade.staffType) {
          case "receptionist":
            receptionistPrice = upgrade.apply(receptionistPrice);
            break;
          case "cleaner":
            cleanerPrice = upgrade.apply(cleanerPrice);
            break;
        }
        break;
      case UpgradeType.StaffEfficiency:
        switch (upgrade.staffType) {
          case "receptionist":
            receptionistCheckinRate = upgrade.apply(receptionistCheckinRate);
            break;
          case "cleaner":
            cleanerCleaningRate = upgrade.apply(cleanerCleaningRate);
            break;
        }
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

  const maxSingleRooms = ROOMS_PER_BUILDING.single.mul(state.buildings.add(1));
  const maxDoubleRooms = ROOMS_PER_BUILDING.double.mul(state.buildings.add(1));
  const maxTripleRooms = ROOMS_PER_BUILDING.triple.mul(state.buildings.add(1));
  const maxQuadRooms = ROOMS_PER_BUILDING.quad.mul(state.buildings.add(1));
  const maxPenthouseRooms = ROOMS_PER_BUILDING.penthouse.mul(
    state.buildings.add(1)
  );

  useComputedStore.setState({
    totalRooms,
    singleRoomPrice,
    doubleRoomPrice,
    tripleRoomPrice,
    quadRoomPrice,
    penthouseRoomPrice,
    buildingPrice,
    incomePerSecond,
    cleanRoomDuration,
    receptionistPrice,
    cleanerPrice,
    receptionistCheckinRate,
    cleanerCleaningRate,
    maxSingleRooms,
    maxDoubleRooms,
    maxTripleRooms,
    maxQuadRooms,
    maxPenthouseRooms,
  });
});

export { useHotelStore };
