import Decimal from "break_infinity.js";
import { create } from "zustand";

interface ComputedStore {
  totalRooms: Decimal;

  singleRoomPrice: Decimal;
  doubleRoomPrice: Decimal;
  tripleRoomPrice: Decimal;
  quadRoomPrice: Decimal;
  penthouseRoomPrice: Decimal;

  receptionistPrice: Decimal;
  cleanerPrice: Decimal;

  receptionistCheckinRate: Decimal;
  cleanerCleaningRate: Decimal;

  incomePerSecond: Decimal;
  cleanRoomDuration: number; // in milliseconds
}

export const useComputedStore = create<ComputedStore>(() => ({
  totalRooms: new Decimal(0),
  singleRoomPrice: new Decimal(10),
  doubleRoomPrice: new Decimal(100),
  tripleRoomPrice: new Decimal(1_000),
  quadRoomPrice: new Decimal(10_000),
  penthouseRoomPrice: new Decimal(100_000),
  incomePerSecond: new Decimal(0),
  cleanRoomDuration: 0, // in milliseconds
  receptionistPrice: new Decimal(20),
  cleanerPrice: new Decimal(30),
  receptionistCheckinRate: new Decimal(0.1), // guests per second
  cleanerCleaningRate: new Decimal(0.05), // rooms per second
}));
