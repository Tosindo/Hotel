import { createContext, useContext } from "react";
import type { Engine } from "./Engine";

const EngineContext = createContext<Engine | null>(null);

const useEngine = () => {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error("useEngine must be used within an EngineProvider");
  }
  return context;
};

export { EngineContext, useEngine };
