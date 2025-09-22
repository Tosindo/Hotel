import dayjs from "dayjs";
import { css } from "../../styled-system/css";
import { Button } from "../core/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../core/Dialog";
import { Sprite } from "../core/Sprite";
import { useSettingsStore } from "../settingsStore";
import { GAME_VERSION } from "../config";
import {
  getGameStateFromCompressedString,
  SAVE_KEY,
  saveGameStateToLocalStorage,
} from "../utils/saveManager";
import { useEngine } from "../engine/EngineContext";

const Settings: React.FC = () => {
  const engine = useEngine();
  const lastSaveAt = useSettingsStore((state) => state.lastSaveAt);

  const onSaveGame = () => {
    const saveString = saveGameStateToLocalStorage(engine.getSaveGameState());
    return saveString;
  };

  const onCopySave = () => {
    const saveString = onSaveGame();
    if (saveString) {
      navigator.clipboard.writeText(saveString).then(
        () => {
          alert("Save copied to clipboard!");
        },
        (err) => {
          alert("Failed to copy save: " + err);
        }
      );
    } else {
      alert("No save data available to copy.");
    }
  };

  const onLoad = () => {
    const saveString = prompt("Paste your save data here:");
    if (saveString) {
      const saveState = getGameStateFromCompressedString(saveString);
      if (!saveState) return;

      // @TODO - validate save string before loading
      engine.loadGameState(saveState);
    }
  };

  const hardReset = () => {
    if (confirm("Are you sure you want to reset your progress?")) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger className={css({ marginLeft: "auto" })} asChild>
        <Button variant="dark">
          <Sprite type="settings" size={28} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Last save:{" "}
          {lastSaveAt ? dayjs(lastSaveAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
        </DialogDescription>
        <Button onClick={() => onSaveGame()}>Save</Button>
        <Button onClick={onLoad}>Load</Button>
        <Button onClick={onCopySave}>Copy Save</Button>
        <Button variant="danger" onClick={hardReset}>
          Hard Reset
        </Button>
        <DialogDescription>v{GAME_VERSION} by Tosindo</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export { Settings };
