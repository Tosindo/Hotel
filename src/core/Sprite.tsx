import clsx from "clsx";
import { css } from "../../styled-system/css";

const spriteCoordinates = {
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

  receptionist: [0, 1],
  cleaner: [1, 1],
  juniorReceptionist: [2, 1],
  juniorCleaner: [3, 1],

  singleRoom: [0, 2],
  doubleRoom: [1, 2],
  tripleRoom: [2, 2],
  quadRoom: [3, 2],
  penthouseRoom: [4, 2],
} as const;

const spriteSheetColumns = 30;
const spriteSheetRows = 30;
const spriteSheetWidth = spriteSheetColumns * 64;
const spriteSheetHeight = spriteSheetRows * 64;
const spriteSize = 64;

type SpriteType = keyof typeof spriteCoordinates;

interface SpriteProps {
  type: SpriteType;
  className?: string;
  size?: number;
}

const cacheBuster = Math.round(Math.random() * 1000000);

const Sprite: React.FC<SpriteProps> = ({ type, className, size = 64 }) => {
  const [col, row] = spriteCoordinates[type] ?? spriteCoordinates["unknown"];

  const sizeScale = size / spriteSize;

  const spriteX = col * spriteSize;
  const spriteY = row * spriteSize;

  return (
    <div
      className={clsx(
        css({
          maskRepeat: "no-repeat",
          background: "current",
          backgroundBlendMode: "multiply",
          //backgroundImage: 'url("/SpriteSheet.png")',
          //backgroundRepeat: "no-repeat",
          display: "inline-block",
          imageRendering: "pixelated",
        }),
        className
      )}
      style={{
        maskImage: `url("${import.meta.env.BASE_URL}SpriteSheet.png?c=${cacheBuster}")`,

        width: `${size}px`,
        height: `${size}px`,
        maskSize: `${spriteSheetWidth * sizeScale}px ${
          spriteSheetHeight * sizeScale
        }px`,
        maskPosition: `-${spriteX * sizeScale}px -${spriteY * sizeScale}px`,
        //backgroundPosition: `-${spriteX}px -${spriteY}px`,
        //backgroundSize: `${spriteSheetWidth * sizeScale}px ${spriteSheetHeight * sizeScale}px`,
      }}
    />
  );
};

export { Sprite };
export type { SpriteType };
