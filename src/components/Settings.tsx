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
import { loadGame, SAVE_KEY, saveGame } from "../saveManager";
import { useSettingsStore } from "../settingsStore";
import { GAME_VERSION } from "../config";

const Settings: React.FC = () => {
  const lastSaveAt = useSettingsStore((state) => state.lastSaveAt);

  const onCopySave = () => {
    const saveString = saveGame();
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
      loadGame(saveString);
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
      <DialogTrigger className={css({ marginLeft: "auto" })}>
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
        <Button onClick={() => saveGame()}>Save</Button>
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
