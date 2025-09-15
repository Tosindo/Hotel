import { useEffect } from "react";
import { css } from "../styled-system/css";
import { Hotel } from "./Hotel";
import { loadGame, saveGame } from "./saveManager";

const styles = css({
  width: "screen",
  height: "screen",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "retro.400",
  color: "white",
});

function App() {
  useEffect(() => {
    loadGame();
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame();
    }, 10000);

    return () => clearInterval(saveInterval);
  }, []);

  return (
    <div className={styles}>
      <Hotel />
    </div>
  );
}

export default App;
