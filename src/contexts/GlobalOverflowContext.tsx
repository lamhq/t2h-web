import React, { useContext } from 'react';
import { createGlobalStyle } from 'styled-components';
import { layout, LayoutProps } from 'styled-system';

const GlobalStyle = createGlobalStyle<LayoutProps>`
  body {
    ${layout}
  }
`;

interface GlobalOverflowContextValue {
  overflowX: LayoutProps['overflowX'];
  overflowY: LayoutProps['overflowY'];
  setGlobalOverflowX: (value: LayoutProps['overflowX']) => void;
  setGlobalOverflowY: (value: LayoutProps['overflowY']) => void;
}

const GlobalOverflowContext = React.createContext<GlobalOverflowContextValue | undefined>(undefined);

export const useGlobalOverflowContext = () => useContext(GlobalOverflowContext);

const GlobalOverflowContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalOverflowX, setGlobalOverflowX] = React.useState<LayoutProps['overflowX']>('hidden');
  const [globalOverflowY, setGlobalOverflowY] = React.useState<LayoutProps['overflowY']>('scroll');

  const contextValue = {
    overflowX: globalOverflowX,
    overflowY: globalOverflowY,
    setGlobalOverflowX,
    setGlobalOverflowY,
  };

  return (
    <>
      <GlobalOverflowContext.Provider value={contextValue}>{children}</GlobalOverflowContext.Provider>;
      <GlobalStyle overflowX={globalOverflowX} overflowY={globalOverflowY} />
    </>
  );
};

export default GlobalOverflowContextProvider;
