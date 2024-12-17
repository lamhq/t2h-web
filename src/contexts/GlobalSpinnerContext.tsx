import React, { useState, useContext, createContext } from 'react';

const GlobalSpinnerContext = createContext(false);
const GlobalSpinnerActionsContext = createContext(null);

export const useGlobalSpinnerContext = () => useContext(GlobalSpinnerContext);
export const useGlobalSpinnerActionsContext = () => useContext(GlobalSpinnerActionsContext);

const GlobalSpinnerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false);

  return (
    <GlobalSpinnerContext.Provider value={isGlobalSpinnerOn}>
      <GlobalSpinnerActionsContext.Provider value={setGlobalSpinner}>{children}</GlobalSpinnerActionsContext.Provider>
    </GlobalSpinnerContext.Provider>
  );
};

export default GlobalSpinnerContextProvider;
