import clsx from "clsx";
import { css } from "../../styled-system/css";
import { spriteCoordinates, type SpriteType } from "../utils/stringToSprite";

const spriteSheetColumns = 30;
const spriteSheetRows = 30;
const spriteSheetWidth = spriteSheetColumns * 64;
const spriteSheetHeight = spriteSheetRows * 64;
const spriteSize = 64;

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
        maskImage: `url("/SpriteSheet.png?c=${cacheBuster}")`,

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
