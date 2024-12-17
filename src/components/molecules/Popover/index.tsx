import React from 'react';
import styled from 'styled-components';
/* eslint-disable no-restricted-imports */
import { Popover as MaterialPopover, PopoverProps as MaterialPopoverProps } from '@material-ui/core';

interface PopoverProps extends MaterialPopoverProps {
  anchor: React.ReactNode;
}

const PopoverContainer = styled.div`
  width: auto;
  height: auto;
  position: relative;
  display: inline-block;
`;

const AnchorContainer = styled.div`
  display: inline-block;
`;

const Popover = (props: PopoverProps) => {
  const { anchor, children, onClose, ...rest } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      setAnchorEl(props.open === false ? e.currentTarget : null);
    },
    [setAnchorEl, props.open],
  );
  const onPopoverClose = React.useCallback(
    (event, reason) => {
      setAnchorEl(null);
      onClose && onClose(event, reason);
    },
    [setAnchorEl, onClose],
  );

  return (
    <PopoverContainer>
      <AnchorContainer onClick={onClick}>{anchor}</AnchorContainer>
      <MaterialPopover onClose={onPopoverClose} anchorEl={anchorEl} {...rest}>
        {children}
      </MaterialPopover>
    </PopoverContainer>
  );
};

export default Popover;
