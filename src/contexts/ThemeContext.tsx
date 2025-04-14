
import React, { createContext, useState, useContext, ReactNode } from "react";

export type ThemeType = "synthwave" | "vinylGroove" | "neonPunk" | "default";

type ThemeContextType = {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("default");

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
