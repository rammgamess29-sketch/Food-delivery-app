import React, { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);

  const value = useMemo(
    () => ({
      isDrawerOpen,
      isCartDrawerOpen,
      toggleDrawer: () => setDrawerOpen((prev) => !prev),
      closeDrawer: () => setDrawerOpen(false),
      openCartDrawer: () => setCartDrawerOpen(true),
      closeCartDrawer: () => setCartDrawerOpen(false),
    }),
    [isDrawerOpen, isCartDrawerOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);