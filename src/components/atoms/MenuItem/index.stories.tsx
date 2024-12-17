import React from 'react';
import styled from 'styled-components';
import { TextLabel } from '@components/atoms/Text';
import {
  MonetizationOnIcon,
  StarBorderIcon,
  PersonIcon,
  CardMembershipIcon,
  LockIcon,
  ExitToAppIcon,
  RocketIcon,
} from '@components/atoms/IconButton';
import { MenuItem } from './index';

export default { title: 'Atoms|MenuItem' };

const MenuList = styled.div`
  padding: 10px;
`;

export const Standard = () => (
  <React.Fragment>
    <MenuList>
      <MenuItem icon={<MonetizationOnIcon />}>
        <TextLabel color="menuText">Coins</TextLabel>
      </MenuItem>
      <MenuItem icon={<RocketIcon />}>
        <TextLabel color="menuText">Boost Schedule</TextLabel>
      </MenuItem>
      <MenuItem icon={<StarBorderIcon />}>
        <TextLabel color="menuText">Favorites</TextLabel>
      </MenuItem>
      <MenuItem icon={<PersonIcon />}>
        <TextLabel color="menuText">Profile details</TextLabel>
      </MenuItem>
      <MenuItem icon={<CardMembershipIcon />}>
        <TextLabel color="menuText">Membership</TextLabel>
      </MenuItem>
      <MenuItem icon={<LockIcon />}>
        <TextLabel color="menuText">Security & Account</TextLabel>
      </MenuItem>
      <MenuItem icon={<ExitToAppIcon />}>
        <TextLabel color="menuText">Sign out</TextLabel>
      </MenuItem>
    </MenuList>
  </React.Fragment>
);
