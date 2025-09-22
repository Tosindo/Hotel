import Decimal from "break_infinity.js";
import { Formatter } from "swarm-numberformat";
import { create } from "zustand";

interface SettingsStore {
  formatter: Formatter;

  setFormattingType: (
    type: "standard" | "scientific" | "engineering" | "longScale"
  ) => void;

  lastSaveAt: number | null;
  setLastSaveAt: (timestamp: number) => void;
}

const useSettingsStore = create<SettingsStore>((set) => ({
  formatter: new Formatter({ format: "standard" }),
  setFormattingType: (type) => {
    set(() => ({
      formatter: new Formatter({
        format: type,
        maxSmall: 1,
        sigfigs: 5,
        backend: "decimal.js",
        // @ts-expect-error - dunno
        Decimal: Decimal,
      }),
    }));
  },
  lastSaveAt: null,
  setLastSaveAt: (timestamp) => set(() => ({ lastSaveAt: timestamp })),
}));

const formatNumber = (
  num: number | string | object | Decimal,
  simple = true
) => {
  const { formatter } = useSettingsStore.getState();
  return formatter.formatShort(num, {
    sigfigs: 5,
    maxSmall: simple ? 0 : 1000,
    minSuffix: simple ? 1e3 : 0,
  });
};

export { useSettingsStore, formatNumber };
