import React, { useState, useContext, createContext } from 'react';
import { AlertMessageVariant } from '@components/atoms/AlertMessage';

type GlobalSnackbarContextProps = {
  message?: string;
  variant?: AlertMessageVariant;
};

const GlobalSnackbarContext = createContext<GlobalSnackbarContextProps>(null);
const GlobalSnackbarActionsContext = createContext(null);

export const useGlobalSnackbarContext = () => useContext(GlobalSnackbarContext);
export const useGlobalSnackbarActionsContext = () => useContext(GlobalSnackbarActionsContext);

const GlobalSnackbarContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalSnackbar, setGlobalSnackbar] = useState<GlobalSnackbarContextProps>(null);

  return (
    <GlobalSnackbarContext.Provider value={globalSnackbar}>
      <GlobalSnackbarActionsContext.Provider value={setGlobalSnackbar}>{children}</GlobalSnackbarActionsContext.Provider>
    </GlobalSnackbarContext.Provider>
  );
};

export default GlobalSnackbarContextProvider;
