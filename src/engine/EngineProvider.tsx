import { Engine } from "./Engine";
import { EngineContext } from "./EngineContext";

const EngineProvider: React.FC<{
  engine: Engine;
  children: React.ReactNode;
}> = ({ engine, children }) => {
  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
};

export { EngineProvider };
