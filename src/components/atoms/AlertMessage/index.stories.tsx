import React from 'react';
import { CheckCircleOutlineIcon, InfoIcon, HighlightOffIcon, SyncIcon } from '@components/atoms/IconButton';
import { TextLink } from '@components/atoms/Text';
import AlertMessage, { MessageTitle } from './index';

export default { title: 'Atoms|AlertMessage' };

export const Standard = () => (
  <React.Fragment>
    <AlertMessage variant="info">Your seller application has been approved. You are now a seller.</AlertMessage>
    <AlertMessage variant="success">Your seller application has been approved. You are now a seller.</AlertMessage>
    <AlertMessage variant="error">Your seller application has been approved. You are now a seller.</AlertMessage>
    <AlertMessage variant="warning">Your seller application has been approved. You are now a seller.</AlertMessage>
  </React.Fragment>
);

export const WithTitle = () => (
  <React.Fragment>
    <AlertMessage variant="success">
      <MessageTitle>
        <CheckCircleOutlineIcon color="white" />
        &nbsp;
        <span>Approved</span>
      </MessageTitle>
      Your seller application has been approved. You are now a seller.{' '}
      <TextLink color="white" variant="medium">
        Get started
      </TextLink>
    </AlertMessage>

    <AlertMessage variant="info">
      <MessageTitle color="text">
        <InfoIcon color="text" />
        &nbsp;
        <span>Approved</span>
      </MessageTitle>
      Your seller application has been approved. You are now a seller.
    </AlertMessage>

    <AlertMessage variant="error">
      <MessageTitle>
        <HighlightOffIcon color="white" />
        &nbsp;
        <span>Rejected</span>
      </MessageTitle>
      Your seller application is rejected. You are now not a seller.
    </AlertMessage>

    <AlertMessage variant="warning">
      <MessageTitle>
        <SyncIcon color="white" />
        &nbsp;
        <span>In review</span>
      </MessageTitle>
      Your seller application is currently being checked and we’ll let you know soon
    </AlertMessage>
  </React.Fragment>
);
