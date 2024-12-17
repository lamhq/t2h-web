import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { VisibilityIcon, VisibilityOffIcon } from '@components/atoms/IconButton';
import InputLabel from '@components/atoms/InputLabel';
import { Text } from '@components/atoms/Text';
import Input from '@components/atoms/Input';
import InputHelperText from '@components/atoms/InputHelperText';

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
  label?: string;
  helperText?: string;
  hasError?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPlainText?: boolean;
  hasBorder?: boolean;
}

const InputTextWapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 14px;
`;

const RightIconWapper = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0px;
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/*
  div {
    position: relative;
    top: 10px;
    left: 9px;
  }
  */

type PasswordVisibilityButtonProps = { onClick: () => void; isVisible: boolean };

const PasswordVisibilityButton: React.FC<PasswordVisibilityButtonProps> = ({ isVisible, onClick }: PasswordVisibilityButtonProps) => {
  return (
    <RightIconWapper onClick={onClick}>{isVisible ? <VisibilityIcon size="19px" /> : <VisibilityOffIcon size="19px" />}</RightIconWapper>
  );
};

// eslint-disable-next-line complexity
const InputText: React.FC<InputTextProps> = React.forwardRef((props: InputTextProps, ref: React.MutableRefObject<HTMLInputElement>) => {
  const { label, helperText, hasError, type, icon, rightIcon, isPlainText, ...rest } = props;
  const [inputType, setInputType] = useState(type);
  const inputPaddingLeft = icon ? '36px' : '9px';

  const handleClick = useCallback(() => {
    setInputType(inputType === 'text' ? 'password' : 'text');
  }, [inputType]);

  return (
    <React.Fragment>
      {label && label.length > 0 && <InputLabel>{label}</InputLabel>}
      <InputTextWapper>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {isPlainText ? (
          <Text my="5px">{props.value}</Text>
        ) : (
          <Input
            ref={ref}
            type={inputType}
            {...rest}
            hasError={hasError}
            aria-label={label || rest.placeholder}
            paddingLeft={inputPaddingLeft}
          ></Input>
        )}
        {rightIcon !== undefined && <RightIconWapper>{rightIcon}</RightIconWapper>}
        {rightIcon === undefined && type === 'password' && (
          <PasswordVisibilityButton onClick={handleClick} isVisible={inputType === 'text'} />
        )}
        {helperText && helperText.length > 0 && <InputHelperText hasError={hasError}>{helperText}</InputHelperText>}
      </InputTextWapper>
    </React.Fragment>
  );
});

InputText.displayName = 'InputText';

InputText.defaultProps = {
  isPlainText: false,
  hasBorder: true,
};

export default InputText;
