import React, { createContext, useState, useEffect } from 'react';

export const SideBarContext = createContext();

export const SideBarProvider = ({ children }) => {
  const [open, setOpen] = useState(true); 

  const openOrClose = () => {
    if (open) {
        setOpen(false)
        return;
    }

    return setOpen(true);
  }
  return (
    <SideBarContext.Provider value={{ open, openOrClose }}>
      {children}
    </SideBarContext.Provider>
  );
};
