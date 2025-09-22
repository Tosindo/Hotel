import { useState } from "react";
import { css } from "../styled-system/css";
import { Hotel } from "./Hotel";
import { Engine } from "./engine/Engine";
import { blueprints } from "./config";
import { EngineProvider } from "./engine/EngineProvider";

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
  const [engine] = useState(() => new Engine(blueprints));

  return (
    <div className={styles}>
      <EngineProvider engine={engine}>
        <Hotel />
      </EngineProvider>
    </div>
  );
}

export default App;
