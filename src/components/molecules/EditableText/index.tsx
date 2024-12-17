import * as React from 'react';
import styled from 'styled-components';
import { border, layout, BorderProps, LayoutProps } from 'styled-system';
import Flex, { FlexProps } from '@components/layouts/Flex';
import { Text, TextProps } from '@components/atoms/Text';
import { CloseIcon, EditIcon } from '@components/atoms/IconButton';
import { moveCursor } from '@common/utils/functions';

const EditableTextContainer = styled(Flex)<BorderProps & LayoutProps>`
  position: relative;
  height: auto;
  ${border};
  ${layout};
`;

const StyledText = styled(Text)<LayoutProps & { isMultiline: boolean }>`
  width: 100%;
  overflow-x: hidden;
  white-space: ${({ isMultiline }) => (isMultiline ? 'normal' : 'nowrap')};
  outline: 0px solid transparent;
  &:after {
    content: '';
    display: inline-block;
    width: 0px;
  }
  ${layout};
`;

const IconContainer = styled(Flex)<{ boxSize: string }>`
  position: absolute;
  right: calc(0px - ${({ boxSize }) => boxSize} / 2);
  top: calc(50% - ${({ boxSize }) => boxSize} / 2);
  width: ${({ boxSize }) => boxSize};
  height: ${({ boxSize }) => boxSize};
  background: white;
  border-radius: 50%;
`;

export interface EditableTextProps {
  isEditIconVisible: boolean;
  isEditable: boolean;
  isMultiline: boolean;
  inputProps?: TextProps & LayoutProps & Omit<TextProps, 'color'> & { color?: string };
  containerProps?: React.HTMLAttributes<HTMLDivElement> & FlexProps & BorderProps & LayoutProps;
  onEditIconClick?: React.MouseEventHandler;
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.SyntheticEvent) => void;
}

const EditableText: React.FC<EditableTextProps> = (props: EditableTextProps) => {
  const { isEditIconVisible, isEditable, isMultiline, onEditIconClick, inputProps, containerProps, defaultValue, onChange, onBlur } = props;

  const [value, setValue] = React.useState(defaultValue ?? '');
  const onTextInput = React.useCallback(
    (e: React.FormEvent<HTMLParagraphElement>) => {
      onChange && onChange(e.currentTarget.innerText);
    },
    [onChange],
  );
  const onTextBlur = React.useCallback(
    (e: React.FocusEvent<HTMLParagraphElement>) => {
      onBlur && onBlur(e);

      setValue(e.currentTarget.innerText);
    },
    [onBlur],
  );

  const inputTextRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (inputTextRef) {
      inputTextRef.current.innerText = value;
    }
  }, [inputTextRef, value]);

  React.useEffect(() => {
    if (inputTextRef && isEditable) {
      inputTextRef.current.focus();
      moveCursor(inputTextRef.current, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputTextRef, isEditable]);

  return (
    <EditableTextContainer alignItems="center" {...containerProps}>
      <StyledText
        ref={inputTextRef}
        contentEditable={isEditable}
        isMultiline={isMultiline}
        {...inputProps}
        onInput={onTextInput}
        onBlur={onTextBlur}
      />
      {isEditIconVisible === true && (
        <IconContainer boxSize="24px" alignItems="center" justifyContent="center">
          {isEditable ? <CloseIcon size="18px" onClick={onEditIconClick} /> : <EditIcon size="18px" onClick={onEditIconClick} />}
        </IconContainer>
      )}
    </EditableTextContainer>
  );
};

EditableText.displayName = 'EditableText';

export default EditableText;
