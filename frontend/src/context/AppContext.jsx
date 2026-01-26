import { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext({
  doctors: [],
  currencySymbol: "$",
  darkMode: "light",
  toggleDarkMode: () => {},
});

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") || "light");

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const value = {
    doctors,
    currencySymbol,
    darkMode,
    toggleDarkMode,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
