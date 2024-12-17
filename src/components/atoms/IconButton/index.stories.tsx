import React from 'react';
import { action } from '@storybook/addon-actions';
import { MenuIcon, SearchIcon, NotificationsNoneIcon, AccountCircleIcon, PhotoCameraIcon, CloudUploadIcon, PersonOutlineIcon } from './';

export default { title: 'Atoms|IconButton' };

export const Simple = () => (
  <React.Fragment>
    <MenuIcon color="link" onClick={action('clicked')} />
    <SearchIcon onClick={action('clicked')} />
    <NotificationsNoneIcon onClick={action('clicked')} />
    <AccountCircleIcon onClick={action('clicked')} />
    <PhotoCameraIcon onClick={action('clicked')} />
    <CloudUploadIcon onClick={action('clicked')} />
    <PersonOutlineIcon onClick={action('clicked')} />
  </React.Fragment>
);
