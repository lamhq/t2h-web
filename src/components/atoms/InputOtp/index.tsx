import React, { useState, RefObject } from 'react';
import styled, { css } from 'styled-components';
import { safeKey } from '@common/utils';

interface InputOtpProps {
  disabled?: boolean;
  codeLength: number;
  onChange?: (value: string) => void;
}

const InputOtpRoot = styled.div``;

const disabledBackgroundStyle = css`
  background-color: rgba(0, 0, 0, 0.1);
`;

const focusBorderStyle = css`
  border: 1px solid ${({ theme }) => theme.colors.text};
`;

const InputCode = styled.input<{ disabled?: boolean }>`
  height: 40px;
  width: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  text-shadow: 0 0 0 ${({ theme }) => theme.colors.text};
  text-align: center;
  font-size: 28px;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  ${(props) => (props.disabled ? disabledBackgroundStyle : '')};

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  -moz-appearance: textfield;

  &.focus {
    ${(props) => (!props.disabled ? focusBorderStyle : '')};
  }

  &:not(:last-child) {
    margin-right: ${({ theme }) => theme.space[2]};
  }
`;

const InputOtp: React.FC<InputOtpProps> = (props: InputOtpProps) => {
  const [activeInput, setActiveInput] = useState(0);
  const [otp, setOtp] = useState<string[]>(Array(props.codeLength).fill(''));
  const refs: RefObject<HTMLInputElement>[] = Array.from(Array(props.codeLength), () => React.createRef());

  /**
   * Change current opt string
   */
  const changeOtp = (value: string) => {
    const newOtp = [...otp];

    newOtp[safeKey(activeInput)] = value;
    setOtp(newOtp);
    props.onChange && props.onChange(newOtp.join(''));
  };

  /**
   * Focus input in the range of 0 to code length - 1
   * Ensure focus within the upperbound and the lowerbound
   */
  const focusInput = (input: number) => {
    const nextActiveInput = Math.max(Math.min(props.codeLength - 1, input), 0);

    setActiveInput(nextActiveInput);
    refs[safeKey(nextActiveInput)].current.focus();
  };

  const focusPreInput = () => {
    const preInput = activeInput - 1;

    focusInput(preInput);
  };

  const focusNextInput = () => {
    const nextInput = activeInput + 1;

    focusInput(nextInput);
  };

  /**
   * Support 4 types of key events backspace, delete, left and right
   */
  // eslint-disable-next-line complexity
  const onKeydown = (e: React.KeyboardEvent) => {
    const BACKSPACE = 8;
    const DELETE = 46;
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;
    const TAB = 9;

    switch (e.keyCode) {
      case BACKSPACE:
        e.preventDefault();
        changeOtp('');
        focusPreInput();
        break;
      case DELETE:
        e.preventDefault();
        changeOtp('');
        break;
      case LEFT_ARROW:
        e.preventDefault();
        focusPreInput();
        break;
      case RIGHT_ARROW:
        e.preventDefault();
        focusNextInput();
        break;
      case TAB:
        e.preventDefault();
        focusNextInput();
        break;
      default:
        break;
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent> | React.TouchEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    focusInput(index);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    const targetValue = value.length > 1 ? value.charAt(value.length - 1) : value;

    if (!Number.isNaN(Number(targetValue))) {
      focusNextInput();
      changeOtp(targetValue);
    }
  };

  return (
    <InputOtpRoot>
      {new Array(props.codeLength).fill(null).map((_, index) => {
        return (
          <InputCode
            ref={refs[safeKey(index)]}
            onTouchEnd={(e) => handleClick(e, index)}
            onMouseDown={(e) => handleClick(e, index)}
            onFocus={(e) => handleFocus(e)}
            onKeyDown={(e) => onKeydown(e)}
            disabled={props.disabled}
            type="number"
            className={activeInput === index ? 'focus' : ''}
            key={index}
            value={otp[safeKey(index)]}
            onChange={(e) => handleInput(e)}
            autoFocus={index === 0}
          />
        );
      })}
    </InputOtpRoot>
  );
};

export default InputOtp;
