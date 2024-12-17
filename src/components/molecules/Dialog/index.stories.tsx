import React from 'react';
import styled from 'styled-components';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { action } from '@storybook/addon-actions';
import Dialog from './index';

export default { title: 'Molecules|Dialog' };

const PhoneContainer = styled.div`
  position: relative;
  width: 400px;
  height: 600px;
  border: 1px solid black;
`;

const DialogContainer = styled.div`
  min-height: 200px;
`;

export const Standard = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);
  const onClose = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);
  const onActionButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    if (isOpen === true) {
      action('Dialog Opened')();
    } else {
      action('Dialog Closed')();
    }
  }, [isOpen]);

  return (
    <PhoneContainer>
      <Button onClick={onButtonClick}>Open Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        showsTitle={true}
        showsCloseIcon={true}
        showsActionButton={true}
        title="Test Dialog"
        actionLabel="Continue"
        onActionClick={onActionButtonClick}
      >
        <DialogContainer>
          <Text>This is a Dialog</Text>
          <Text>You can close by clicking button or background</Text>
        </DialogContainer>
      </Dialog>
    </PhoneContainer>
  );
};

export const WithDialogTitle = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);
  const onClose = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    if (isOpen === true) {
      action('Dialog Opened')();
    } else {
      action('Dialog Closed')();
    }
  }, [isOpen]);

  return (
    <PhoneContainer>
      <Button onClick={onButtonClick}>Open Dialog</Button>
      <Dialog isOpen={isOpen} onClose={onClose} showsTitle={true} title="Test Dialog">
        <DialogContainer>
          <Text>This is a Dialog</Text>
          <Text>You can close by clicking button or background</Text>
        </DialogContainer>
      </Dialog>
    </PhoneContainer>
  );
};

export const WithDialogCloseIcon = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);
  const onClose = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    if (isOpen === true) {
      action('Dialog Opened')();
    } else {
      action('Dialog Closed')();
    }
  }, [isOpen]);

  return (
    <PhoneContainer>
      <Button onClick={onButtonClick}>Open Dialog</Button>
      <Dialog isOpen={isOpen} onClose={onClose} showsCloseIcon={true}>
        <DialogContainer>
          <Text>This is a Dialog</Text>
          <Text>You can close by clicking button or background</Text>
        </DialogContainer>
      </Dialog>
    </PhoneContainer>
  );
};

export const WithActionButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);
  const onClose = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);
  const onActionButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    if (isOpen === true) {
      action('Dialog Opened')();
    } else {
      action('Dialog Closed')();
    }
  }, [isOpen]);

  return (
    <PhoneContainer>
      <Button onClick={onButtonClick}>Open Dialog</Button>
      <Dialog isOpen={isOpen} onClose={onClose} showsActionButton={true} actionLabel="Continue" onActionClick={onActionButtonClick}>
        <DialogContainer>
          <Text>This is a Dialog</Text>
          <Text>You can close by clicking button or background</Text>
        </DialogContainer>
      </Dialog>
    </PhoneContainer>
  );
};
