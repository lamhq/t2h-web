import React, { useState, useCallback } from 'react';
import { Button } from '@components/atoms/Button';
import Snackbar from './index';

export default { title: 'Organisms|Snackbar' };

export const Success = () => {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const handleClose = useCallback(() => {
    setIsSnackbarVisible(false);
  }, []);

  return (
    <React.Fragment>
      <Button onClick={() => setIsSnackbarVisible((v) => !v)}>Toggle</Button>
      <Snackbar variant="success" isVisible={isSnackbarVisible} onClose={handleClose}>
        Success Message
      </Snackbar>
    </React.Fragment>
  );
};

export const Error = () => {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const handleClose = useCallback(() => {
    setIsSnackbarVisible(false);
  }, []);

  return (
    <React.Fragment>
      <Button onClick={() => setIsSnackbarVisible((v) => !v)}>Toggle</Button>
      <Snackbar variant="error" isVisible={isSnackbarVisible} onClose={handleClose}>
        Network error happened. Please try again later.
      </Snackbar>
    </React.Fragment>
  );
};
