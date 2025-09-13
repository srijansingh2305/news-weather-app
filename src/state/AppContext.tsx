// src/state/AppContext.tsx
import React, { createContext, useState, ReactNode } from "react";

type AppContextType = {
  city: string;
  setCity: (city: string) => void;
  unit: "metric" | "imperial";
  setUnit: (u: "metric" | "imperial") => void;
  categories: string[];
  setCategories: (c: string[]) => void;
};

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  refreshAll: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  refreshAll: async () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState("Delhi");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [categories, setCategories] = useState<string[]>([]);

  return (
    <AppContext.Provider value={{ city, setCity, unit, setUnit, categories, setCategories }}>
      {children}
    </AppContext.Provider>
  );
}
