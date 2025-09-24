import { BigButton } from "../core/BigButton";
import { Tooltip } from "../core/Tooltip";
import { Sprite } from "../core/Sprite";
import { useEngine } from "../engine/EngineContext";
import { useEngineSelector } from "../engine/useEngineSelector";
import { HandOutFlyers, PenAndPaper } from "../units/Services/PenAndPaper";
import { css } from "../../styled-system/css";
import { Button } from "../core/Button";
import { formatNumber } from "../settingsStore";

const animatedPanelStyles = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  shadow: "inset-retro",
  gap: "4",
  w: "44",
  h: "44",
  borderWidth: "4",
  borderColor: "retro.900",
  color: "retro.900",

  p: "2",
  _loading: {
    "--cursor": "wait",
    p: "0",
  },
});

const HandOutFlyersButton: React.FC = () => {
  const engine = useEngine();

  const stage = useEngineSelector(
    [HandOutFlyers.key.getStateValueKey("stage")],
    (engine) => () => engine.getStateValue(HandOutFlyers.key, "stage")
  );

  const isCreepy = useEngineSelector(
    [HandOutFlyers.key.getStateValueKey("isCreepy")],
    (engine) => () => engine.getStateValue(HandOutFlyers.key, "isCreepy")
  );

  const pendingGuests = useEngineSelector(
    [HandOutFlyers.key.getStateValueKey("pendingGuests")],
    (engine) => () => engine.getStateValue(HandOutFlyers.key, "pendingGuests")
  );

  const successChance = useEngineSelector(
    [HandOutFlyers.key.getComputedValueKey("successChance")],
    (engine) => () =>
      engine.getComputedDecimal(HandOutFlyers.key, "successChance")
  );

  const unlockedAction = useEngineSelector(
    [PenAndPaper.key.getCountKey()],
    (engine) => () => engine.getUnitCount(PenAndPaper.key).gt(0)
  );

  if (!unlockedAction) return null;

  return (
    <Tooltip
      content={
        stage === "none"
          ? "Hand out flyers to strangers outside. They might coome in and book a room, spooky!"
          : ""
      }
      side="bottom"
    >
      <div>
        {stage === "none" && (
          <BigButton
            onClick={() =>
              engine.dispatchAction(HandOutFlyers.key, "startHandingOutFlyers")
            }
          >
            <Sprite type="distributeFlyer" size={48} />
            Hand out flyers
          </BigButton>
        )}
        {stage === "walking" && (
          <div aria-disabled aria-busy={true} className={animatedPanelStyles}>
            <Sprite
              type="distributeFlyersWalk"
              size={174}
              repeatAnimation={false}
            />
          </div>
        )}
        {stage === "handingOut" && (
          <div aria-disabled aria-busy={true} className={animatedPanelStyles}>
            <Sprite
              type="distributeFlyersGive"
              size={174}
              repeatAnimation={false}
            />
          </div>
        )}
        {stage === "failure" && (
          <div aria-disabled aria-busy={true} className={animatedPanelStyles}>
            <Sprite
              type={isCreepy ? "sadderFace" : "sadFace"}
              size={120}
              repeatAnimation={false}
            />
          </div>
        )}
        {stage === "success" && (
          <div aria-disabled aria-busy={true} className={animatedPanelStyles}>
            <Sprite
              type={isCreepy ? "happierFace" : "happyFace"}
              size={120}
              repeatAnimation={false}
            />
          </div>
        )}
        {stage === "decision" && (
          <div className={animatedPanelStyles}>
            <span>{formatNumber(pendingGuests)} Guest(s)</span>
            <Tooltip
              content={`You have a ${formatNumber(
                successChance
              )}% chance of convincing more guests to stay. But if you fail, they will all leave!`}
              side="top"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  engine.dispatchAction(
                    HandOutFlyers.key,
                    "continueHandingOutFlyers"
                  );
                }}
              >
                Keep Going
              </Button>
            </Tooltip>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                engine.dispatchAction(
                  HandOutFlyers.key,
                  "collectPendingGuests"
                );
              }}
            >
              Head Back
            </Button>
          </div>
        )}
      </div>
    </Tooltip>
  );
};

export { HandOutFlyersButton };
