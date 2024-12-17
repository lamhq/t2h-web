import * as React from 'react';
import styled from 'styled-components';
import { position, color, flexbox, space, PositionProps, LayoutProps, ColorProps, FlexboxProps, SpaceProps } from 'styled-system';
import { theme } from '@components/global/theme';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import Card from '@components/atoms/Card';
import { TextLabel } from '@components/atoms/Text';
import { CancelIcon } from '@components/atoms/IconButton';
import { Button } from '@components/atoms/Button';

interface DialogProps extends React.HTMLAttributes<HTMLElement> {
  isOpen?: boolean;
  showsCloseIcon?: boolean;
  showsTitle?: boolean;
  showsActionButton?: boolean;

  actions?: { label?: string; onActionClick?: React.MouseEventHandler }[];

  onClose?: (e: React.SyntheticEvent) => void;
  onActionClick?: React.MouseEventHandler;

  BackgroundProps?: DialogBackgroundProps;
  ContainerProps?: DialogContainerProps;
}

interface DialogBackgroundProps extends FlexboxProps, ColorProps, PositionProps {
  onClick?: React.MouseEventHandler;
}

const DialogBackground: React.FC<DialogBackgroundProps> = styled.div<DialogBackgroundProps>`
  ${flexbox}
  ${color}
  ${position}
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
`;

DialogBackground.defaultProps = {
  color: 'black',
  backgroundColor: theme.colors.dialogBackground,
  justifyContent: 'center',
  zIndex: 1001,
};

interface DialogContainerProps extends ColorProps, LayoutProps, PositionProps, SpaceProps {
  onClick?: React.MouseEventHandler;
}

const TopPadding = styled.div`
  padding-top: 10px;
`;

const DialogContainer: React.FC<DialogContainerProps> = styled(Card)<DialogContainerProps>`
  ${position}
  ${space}
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

DialogContainer.defaultProps = {
  backgroundColor: theme.colors.white,
  width: '288px',
  height: 'auto',
  padding: 3,
};

interface DialogHeaderProps {
  showsTitle?: boolean;
  showsCloseIcon?: boolean;
  showsActionButton?: boolean;

  title?: string;

  onClickTitle?: React.MouseEventHandler;
  onClickCloseIcon?: React.MouseEventHandler;
}

const DialogHeader: React.FC<DialogHeaderProps> = (props: DialogHeaderProps) => {
  if (props.showsTitle !== true && props.showsCloseIcon !== true) return null;

  return (
    <Flex alignItems="center" mb={3}>
      {props.showsTitle === true && (
        <TextLabel variant="large" color="primary" onClick={props.onClickTitle}>
          {props.title}
        </TextLabel>
      )}
      {props.showsCloseIcon === true && (
        <Box ml="auto">
          <CancelIcon onClick={props.onClickCloseIcon} size="18px" />
        </Box>
      )}
    </Flex>
  );
};

interface DialogFooterProps {
  actions?: { label?: string; onActionClick?: React.MouseEventHandler; transparent?: boolean }[];
}

const DialogFooter: React.FC<DialogFooterProps> = (props: DialogFooterProps) => {
  const { actions } = props;

  return (
    <React.Fragment>
      {actions &&
        actions.map(({ label, onActionClick, transparent }, idx) => (
          <React.Fragment key={idx}>
            <TopPadding />
            <Flex alignItems="center" mt="auto" mb={0}>
              <Button
                variant={transparent ? 'transparent' : 'primary'}
                type={transparent ? 'submit' : 'button'}
                form="my-form-id"
                onClick={onActionClick}
              >
                {label}
              </Button>
            </Flex>
          </React.Fragment>
        ))}
    </React.Fragment>
  );
};

const Dialog: React.FC<DialogProps> = (props: DialogProps) => {
  const [isOpen, setIsOpen] = React.useState(props.isOpen);

  React.useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const onDialogContainerClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const onDialogBackgroundClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen(false);
      props.onClose && props.onClose(e);
    },
    [setIsOpen, props],
  );
  const onClickCloseIcon = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen(false);
      props.onClose && props.onClose(e);
    },
    [setIsOpen, props],
  );

  if (isOpen !== true) return null;

  return (
    <DialogBackground onClick={onDialogBackgroundClick} {...props.BackgroundProps}>
      <DialogContainer onClick={onDialogContainerClick} {...props.ContainerProps}>
        <DialogHeader {...props} onClickCloseIcon={onClickCloseIcon} />
        {props.children}
        <DialogFooter {...props} />
      </DialogContainer>
    </DialogBackground>
  );
};

export default Dialog;
