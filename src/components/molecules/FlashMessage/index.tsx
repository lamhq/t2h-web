import React, { useCallback } from 'react';
import { Text } from '@components/atoms/Text';
import { CloseIcon } from '@components/atoms/IconButton';
import AlertMessage, { AlertMessageProps } from '@components/atoms/AlertMessage';
import Flex from '@components/layouts/Flex';

export type FlashMessageProps = Omit<AlertMessageProps, 'color'> & {
  isVisible: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  isCloseIconHidden?: boolean;
};

const FlashMessage: React.FC<FlashMessageProps> = ({ isVisible, onClose, children, isCloseIconHidden, ...rest }: FlashMessageProps) => {
  const handleClick = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  return (
    <React.Fragment>
      {isVisible && (
        <AlertMessage {...rest}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Text color="white" m={0}>
              {children}
            </Text>
            {isCloseIconHidden !== true && <CloseIcon color="white" onClick={handleClick} />}
          </Flex>
        </AlertMessage>
      )}
    </React.Fragment>
  );
};

export default FlashMessage;
