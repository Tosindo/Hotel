import Decimal from "break_infinity.js";
import { create } from "zustand";

interface ComputedStore {
  totalRooms: Decimal;

  singleRoomPrice: Decimal;
  doubleRoomPrice: Decimal;
  tripleRoomPrice: Decimal;
  quadRoomPrice: Decimal;
  penthouseRoomPrice: Decimal;

  buildingPrice: Decimal;

  receptionistPrice: Decimal;
  cleanerPrice: Decimal;

  juniorReceptionistPrice: Decimal;
  juniorCleanerPrice: Decimal;

  receptionistCheckinRate: Decimal;
  cleanerCleaningRate: Decimal;

  incomePerSecond: Decimal;
  cleanRoomDuration: number; // in milliseconds

  maxSingleRooms: Decimal;
  maxDoubleRooms: Decimal;
  maxTripleRooms: Decimal;
  maxQuadRooms: Decimal;
  maxPenthouseRooms: Decimal;
}

export const useComputedStore = create<ComputedStore>(() => ({
  totalRooms: new Decimal(0),
  singleRoomPrice: new Decimal(10),
  doubleRoomPrice: new Decimal(100),
  tripleRoomPrice: new Decimal(1_000),
  quadRoomPrice: new Decimal(10_000),
  penthouseRoomPrice: new Decimal(100_000),
  buildingPrice: new Decimal(1000),
  incomePerSecond: new Decimal(0),
  cleanRoomDuration: 0, // in milliseconds
  receptionistPrice: new Decimal(20),
  cleanerPrice: new Decimal(30),
  receptionistCheckinRate: new Decimal(0.1), // guests per second
  cleanerCleaningRate: new Decimal(0.05), // rooms per second
  maxSingleRooms: new Decimal(0),
  maxDoubleRooms: new Decimal(0),
  maxTripleRooms: new Decimal(0),
  maxQuadRooms: new Decimal(0),
  maxPenthouseRooms: new Decimal(0),
  juniorReceptionistPrice: new Decimal(15),
  juniorCleanerPrice: new Decimal(25),
}));
