import React, { useCallback } from 'react';
import FlashMessage, { FlashMessageProps } from '@components/molecules/FlashMessage';
// eslint-disable-next-line no-restricted-imports
import { Snackbar as MaterialUISnackbar } from '@material-ui/core';

export type SnackbarProps = FlashMessageProps & { autoHideDuration?: number; isCloseIconHidden?: boolean };

const Snackbar: React.FC<SnackbarProps> = ({
  isVisible,
  onClose,
  autoHideDuration,
  children,
  variant,
  isCloseIconHidden,
  ...rest
}: SnackbarProps) => {
  const handleClick = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  return (
    <MaterialUISnackbar open={isVisible} autoHideDuration={autoHideDuration} onClose={handleClick}>
      <FlashMessage {...rest} variant={variant} isVisible={true} onClose={handleClick} isCloseIconHidden={isCloseIconHidden}>
        {children}
      </FlashMessage>
    </MaterialUISnackbar>
  );
};

Snackbar.defaultProps = {
  autoHideDuration: 6000,
};

export default Snackbar;
