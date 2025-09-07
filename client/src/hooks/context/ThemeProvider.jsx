// ThemeContext.jsx
import { useState, useEffect } from "react";
import { ThemeContext } from "./useThemeContext";



export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      if (mode === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          media.matches ? "dark" : "light"
        );
      }
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [mode]);

  useEffect(() => {
    const resolved =
      mode === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
        : mode;

    document.documentElement.setAttribute("data-theme", resolved);

    if (mode === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
