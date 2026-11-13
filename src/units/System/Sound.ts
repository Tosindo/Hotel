import { DecimalOne } from "../../engine/constants";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";

const audioFiles = {
  success: `${import.meta.env.BASE_URL}audio/success.wav`,
  success_distorted: `${import.meta.env.BASE_URL}audio/success_distorted.wav`,
  failure: `${import.meta.env.BASE_URL}audio/failure.wav`,
  failure_distorted: `${import.meta.env.BASE_URL}audio/failure_distorted.wav`,
  paper: `${import.meta.env.BASE_URL}audio/paper.wav`,
};

const Sound = createUnitBlueprint("sound", {
  type: UnitType.SYSTEM,
  getInitialState() {
    return {};
  },
  getActions() {
    return {
      playSound: (soundKey: keyof typeof audioFiles) => {
        const audio = new Audio(audioFiles[soundKey]);
        audio.volume = 1;
        audio.play();
      },
    };
  },

  initialize(k, _s, { updateCount }) {
    updateCount(k, DecimalOne);
  },
});

export { Sound };
