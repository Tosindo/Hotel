export const spriteCoordinates = {
  unknown: [0, 0],

  checkIn: [1, 0],
  cleaning: [2, 0],
  money: [3, 0],
  income: [4, 0],
  clock: [5, 0],
  bankNote: [6, 0],
  check: [7, 0],
  close: [8, 0],
  settings: [9, 0],
  ball: [10, 0],

  receptionist: [0, 1],
  cleaner: [1, 1],
  juniorReceptionist: [2, 1],
  juniorCleaner: [3, 1],
  jervasio: [4, 1],

  singleRoom: [0, 2],
  doubleRoom: [1, 2],
  tripleRoom: [2, 2],
  quadRoom: [3, 2],
  penthouseRoom: [4, 2],

  grabbingHand: [0, 3],
} as const;

export type SpriteType = keyof typeof spriteCoordinates;

export const stringToSprite = (str: string): SpriteType => {
  if (str in spriteCoordinates) {
    return str as SpriteType;
  }
  return "unknown";
};
