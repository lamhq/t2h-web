import React from 'react';
import { TFunction } from 'next-i18next';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import Box from '@components/layouts/Box';
import { Button } from '@components/atoms/Button';
import { FormControl } from '@components/layouts/FormGroup';
import Dialog from '@components/molecules/Dialog';

interface DeleteItemDialogProps {
  t: TFunction;
  offsetTop: number;
  isOpen: boolean;
  onClose: (e?: React.SyntheticEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

const DeleteItemDialog = (props: DeleteItemDialogProps) => {
  const { t, isOpen, onClose, onDeleteClick, offsetTop } = props;

  const onCancelClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClose && onClose(e);
    },
    [onClose],
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      showsTitle={false}
      showsCloseIcon={false}
      showsActionButton={false}
      ContainerProps={{ top: `calc(${offsetTop}px + 16px)` }}
    >
      <Box>
        <Title mt={0} mb={0} fontSize={5} color="boost" fontWeight="bold" textAlign="left">
          {t(`Delete listing`)}
        </Title>

        <Text mt="22px" mb={0} fontFamily="secondary">
          {`${t(`Are you sure you want to`)}`}
          <Text mt={0} mb={0} fontWeight="bold" fontFamily="secondary">
            {t(`Permanently delete`)}
          </Text>
          {`${t(`listing?`)}`}
        </Text>
      </Box>
      <Box mt="55px">
        <FormControl mt={0} mb={0}>
          <Button variant="delete" onClick={onDeleteClick}>
            {t(`Delete listing`)}
          </Button>
        </FormControl>
        <FormControl mt={3} mb={0}>
          <Button variant="primary" onClick={onCancelClick}>
            {t(`Cancel`)}
          </Button>
        </FormControl>
      </Box>
    </Dialog>
  );
};

export default DeleteItemDialog;
