import React, { useCallback } from 'react';
import Snackbar from '@components/organisms/Snackbar';
import { useGlobalSnackbarContext, useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';

const GlobalSnackbar = () => {
  const state = useGlobalSnackbarContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const handleClose = useCallback(() => {
    setGlobalSnackbar(null);
  }, [setGlobalSnackbar]);

  if (!state) {
    return null;
  }

  const { message, variant = 'success' } = state;

  return (
    <React.Fragment>
      {message && (
        <Snackbar isVisible={true} variant={variant} onClose={handleClose}>
          {message}
        </Snackbar>
      )}
    </React.Fragment>
  );
};

export default GlobalSnackbar;
