"use client";

import React, { createContext, useContext, useState } from "react";

interface AppContextProps {
  isSoundOn: boolean;
  onSoundChange: () => void;
}

const defaultAppContext: AppContextProps = {
  isSoundOn: true,
  onSoundChange: () => {},
};

const AppContext = createContext<AppContextProps>({ ...defaultAppContext });

export const AppProvider = ({ children }: React.PropsWithChildren & {}) => {
  const [isSoundOn, setIsSoundOn] = useState(false);

  const onSoundChange = () => setIsSoundOn(!isSoundOn);

  return <AppContext.Provider value={{ isSoundOn, onSoundChange }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
