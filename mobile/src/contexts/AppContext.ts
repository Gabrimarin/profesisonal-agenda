import { createContext, useContext } from "react";

const AppContext = createContext<{
  user: any;
  setUser: (user: any) => void;
}>({
  user: null,
  setUser: (user: any) => {},
});

export const AppContextProvider = AppContext.Provider;

export const useAppContext = () => {
  return useContext(AppContext);
};
