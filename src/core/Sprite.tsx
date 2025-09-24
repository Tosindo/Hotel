import clsx from "clsx";
import { css } from "../../styled-system/css";
import {
  spriteAnimationConfig,
  spriteCoordinates,
  type SpriteAnimationType,
  type SpriteType,
} from "../utils/stringToSprite";

const spriteSheetColumns = 30;
const spriteSheetRows = 30;
const spriteSheetWidth = spriteSheetColumns * 64;
const spriteSheetHeight = spriteSheetRows * 64;
const spriteSize = 64;

interface SpriteProps {
  type: SpriteType | SpriteAnimationType;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
  repeatAnimation?: boolean; // default true
}

const cacheBuster = Math.round(Math.random() * 1000000);

const Sprite: React.FC<SpriteProps> = ({
  type,
  className,
  size = 64,
  style,
  repeatAnimation = true,
}) => {
  const isAnimation = type in spriteAnimationConfig;

  if (isAnimation) {
    const config = spriteAnimationConfig[type as SpriteAnimationType];
    const sizeScale = size / config.frameSize;
    const animationSheetWidth = config.frameCount * config.frameSize;
    const animationName = `keyframes_${type}`;

    const lastFrameXPosition =
      (config.frameCount - 1) * config.frameSize * sizeScale;

    const keyframes = `
      @keyframes ${animationName} {
        from {
          mask-position: 0px 0px;
        }
        to {
          mask-position: -${animationSheetWidth * sizeScale}px 0px;
        }
      }
    `;

    const animationFillMode = repeatAnimation ? "infinite" : "backwards";
    const finalMaskPosition = repeatAnimation
      ? undefined
      : `-${lastFrameXPosition}px 0px`;

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: keyframes }} />
        <div
          className={clsx(
            css({
              maskRepeat: "no-repeat",
              background: "current",
              backgroundBlendMode: "multiply",
              display: "inline-block",
              imageRendering: "pixelated",
            }),
            className
          )}
          style={{
            maskImage: `url("${config.url}?c=${cacheBuster}")`,

            width: `${size}px`,
            height: `${size}px`,
            maskSize: `${animationSheetWidth * sizeScale}px ${size}px`,
            animation: `${animationName} ${config.duration}ms steps(${
              config.frameCount
            }) ${animationFillMode}`,
            maskPosition: finalMaskPosition,
            //backgroundPosition: `-${spriteX}px -${spriteY}px`,
            //backgroundSize: `${spriteSheetWidth * sizeScale}px ${spriteSheetHeight * sizeScale}px`,
            ...style,
          }}
        />
      </>
    );
  }

  const [col, row] =
    spriteCoordinates[type as SpriteType] ?? spriteCoordinates["unknown"];

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
        ...style,
      }}
    />
  );
};

export { Sprite };
