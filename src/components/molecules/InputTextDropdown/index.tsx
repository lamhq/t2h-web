import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import InputLabel from '@components/atoms/InputLabel';
import { Text, TextLabel } from '@components/atoms/Text';
import Input from '@components/atoms/Input';
import InputHelperText from '@components/atoms/InputHelperText';
import { mergeRefs } from '@common/utils/hooks';

export interface InputTextDropdownProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
  label?: string;
  helperText?: string;
  hasError?: boolean;
  icon?: React.ReactNode;
  isPlainText?: boolean;
  items: string[];
}

const InputTextDropdownWapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 14px;
`;

const DropdownMenu = styled.div`
  background-color: #ffffff;
  border: ${({ theme }) => theme.colors.border};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  margin-top: 1px;
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1000;
`;

const DropdownOption = styled.div`
  color: ${({ theme }) => theme.colors.inputText};
  padding: 8px 12px 8px 12px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.selected};
  }
`;

const InputTextDropdown: React.FC<InputTextDropdownProps> = React.forwardRef(
  (props: InputTextDropdownProps, ref: React.MutableRefObject<HTMLInputElement>) => {
    const { label, helperText, hasError, items, icon, isPlainText, onChange, onFocus, onBlur, ...rest } = props;
    const inputPaddingLeft = icon ? '36px' : '9px';
    const [isOpen, setIsOpenValue] = useState(false);
    const inputRef = useRef(null);

    const handleChange = useCallback(
      (e) => {
        onChange && onChange(e);
      },
      [onChange],
    );

    const handleFocus = useCallback(
      (e) => {
        onFocus && onFocus(e);
        setIsOpenValue(true);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e) => {
        onBlur && onBlur(e);
        setIsOpenValue(false);
      },
      [onBlur],
    );

    const handleSelectValue = useCallback(
      (e: React.FormEvent<HTMLDivElement>, text: string) => {
        e.stopPropagation();
        const inputEvent = new Event('input', { bubbles: true });

        inputRef.current.value = text;
        inputRef.current.dispatchEvent(inputEvent);
        onChange && onChange(inputEvent as any);
        setIsOpenValue(false);
      },
      [inputRef, onChange],
    );

    return (
      <React.Fragment>
        {label && label.length > 0 && <InputLabel>{label}</InputLabel>}
        <InputTextDropdownWapper>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          {isPlainText ? (
            <Text my="5px">{props.value}</Text>
          ) : (
            <Input
              ref={mergeRefs([ref, inputRef])}
              {...rest}
              autoComplete="off"
              hasError={hasError}
              aria-label={label || rest.placeholder}
              paddingLeft={inputPaddingLeft}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></Input>
          )}
          {helperText && helperText.length > 0 && (
            <InputHelperText style={{ height: '0px' }} hasError={hasError}>
              {helperText}
            </InputHelperText>
          )}
          {isOpen && (
            <DropdownMenu>
              {items.map((text: string, idx: number) => {
                return (
                  <DropdownOption key={idx} onMouseDown={(e) => handleSelectValue(e, text)} onClick={(e) => handleSelectValue(e, text)}>
                    <TextLabel color="inputText" variant="small">
                      {text}
                    </TextLabel>
                  </DropdownOption>
                );
              })}
            </DropdownMenu>
          )}
        </InputTextDropdownWapper>
      </React.Fragment>
    );
  },
);

InputTextDropdown.displayName = 'InputTextDropdown';

InputTextDropdown.defaultProps = {
  items: [],
  isPlainText: false,
};

export default InputTextDropdown;
