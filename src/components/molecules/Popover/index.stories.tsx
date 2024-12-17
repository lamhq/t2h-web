import React from 'react';
import styled from 'styled-components';
import { MoreVertIcon } from '@components/atoms/IconButton';
import Popover from './index';

export default { title: 'Molecules|Popover' };

const Container = styled.div`
  width: 1000px;
  padding: 100px;
`;

export const Normal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen((isOpen) => !isOpen);
  };
  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Container>
      <Popover
        open={isOpen}
        onClose={onClose}
        anchor={<MoreVertIcon onClick={onIconClick} />}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <div style={{ width: '200px', height: '300px' }}>hello</div>
      </Popover>
    </Container>
  );
};
