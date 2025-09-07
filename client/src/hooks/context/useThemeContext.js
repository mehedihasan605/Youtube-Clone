// useTheme.js
import { useContext, createContext } from "react";


export const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);
