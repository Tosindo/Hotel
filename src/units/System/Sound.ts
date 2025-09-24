import { DecimalOne } from "../../engine/constants";
import { createUnitBlueprint } from "../../engine/createUnitBlueprint";
import { UnitType } from "../../engine/types";

const audioFiles = {
  success: "/audio/success.wav",
  success_distorted: "/audio/success_distorted.wav",
  failure: "/audio/failure.wav",
  failure_distorted: "/audio/failure_distorted.wav",
  paper: "/audio/paper.wav",
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
