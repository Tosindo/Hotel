import { useRef, useSyncExternalStore } from "react";
import { useEngine } from "./EngineContext";
import type { DependencyKey } from "./types";
import type { Engine } from "./Engine";

export function useEngineSelector<T>(
  // The keys this selector depends on
  dependencies: DependencyKey[],
  // The function to get the latest value
  getSnapshot: (engine: Engine) => () => T
) {
  const engine = useEngine();

  const subscribe = (callback: () => void) => {
    if (dependencies.length === 0) {
      return () => {};
    }

    return engine.subscribe(dependencies, callback);
  };

  const getSnapshotRef = useRef(getSnapshot(engine));
  getSnapshotRef.current = getSnapshot(engine);

  return useSyncExternalStore(subscribe, getSnapshotRef.current);
}
