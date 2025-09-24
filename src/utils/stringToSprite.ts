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
  arrowDown: [11, 0],
  arrowUp: [12, 0],
  cart: [13, 0],
  peopleOdd: [14, 0],
  people: [15, 0],
  distributeFlyer: [16, 0],
  happyFace: [17, 0],
  happierFace: [18, 0],
  sadFace: [19, 0],
  sadderFace: [20, 0],

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

  cursor: [0, 4],
  cursorPointer: [1, 4],
  cursorWait: [2, 4],
  cursorGrab: [3, 4],
  cursorGrabbing: [4, 4],
  cursorCart: [5, 4],
  cursorBroom: [6, 4],
  cursorlessBroom: [7, 4],

  penAndPaper: [0, 5],
} as const;

export const spriteAnimationConfig = {
  distributeFlyersWalk: {
    url: "/animations/DistributingFlyersWalk.png",
    frameCount: 40,
    frameSize: 64,
    duration: 2850, // 14 frames per second
  },
  distributeFlyersGive: {
    url: "/animations/DistributingFlyersGive.png",
    frameCount: 15,
    frameSize: 64,
    duration: 1100, // 14 frames per second
  },
};

export type SpriteType = keyof typeof spriteCoordinates;
export type SpriteAnimationType = keyof typeof spriteAnimationConfig;

export const stringToSprite = (
  str: string
): SpriteType | SpriteAnimationType => {
  if (str in spriteCoordinates) {
    return str as SpriteType;
  }

  if (str in spriteAnimationConfig) {
    return str as SpriteAnimationType;
  }

  return "unknown";
};
