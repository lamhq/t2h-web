import React from 'react';
import styled from 'styled-components';
import { MoreVertIcon } from '@components/atoms/IconButton';
import Popover from '@components/molecules/Popover';

const ItemMenusContainer = styled.div`
  padding: 8px;
  box-sizing: border-box;
`;

const ItemDropdown = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onIconClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen((isOpen) => !isOpen);
    },
    [setIsOpen],
  );
  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const onMenuClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen(false);
    },
    [setIsOpen],
  );
  const onContainerClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div onClick={onContainerClick}>
      <Popover
        open={isOpen}
        onClose={onClose}
        anchor={<MoreVertIcon onClick={onIconClick} size="18px" />}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <ItemMenusContainer onClick={onMenuClick}>{children}</ItemMenusContainer>
      </Popover>
    </div>
  );
};

export default ItemDropdown;
