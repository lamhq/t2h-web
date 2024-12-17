import React from 'react';
import styled from 'styled-components';
import Input from '@components/atoms/Input';
import { mergeRefs } from '@common/utils/hooks';

export interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputRef?: React.MutableRefObject<HTMLInputElement>;
  label?: string;
  helperText?: string;
  hasError?: boolean;
  digitPatterns?: number[];
  delimiter?: string;
  shouldEliminateRest?: boolean;
  icon?: React.ReactNode;
}

const InputNumberWrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 14px;
`;

const formValueToString = (value: number | string | string[] = '') => {
  if (Array.isArray(value)) {
    return value.join('');
  } else {
    return value.toString();
  }
};

const removeDelimiterFromText = (text: string, delimiter?: string) => {
  if (!delimiter) {
    return text;
  }

  return text.split(delimiter).join('');
};

const removeNonNumericText = (text: string = '') => {
  return text.replace(/\D/g, '');
};

const getOriginalText = (text: string, type: string, delimiter: string) => {
  const textWithoutDelimiter = removeDelimiterFromText(text, delimiter);

  if (type === 'number') {
    return removeNonNumericText(textWithoutDelimiter);
  }

  return textWithoutDelimiter;
};

const formatText = (
  text: string,
  type: string,
  digitPatterns: number[] = [],
  delimiter: string = '',
  shouldEliminateRest: boolean = true,
) => {
  const originalText = getOriginalText(text, type, delimiter);
  let formattedText = '';
  let leftIndex = 0;

  digitPatterns.forEach((len: number, i: number) => {
    const subText = originalText.slice(leftIndex, leftIndex + len);

    if (subText.length > 0) {
      formattedText += subText;
      // If subText fulfill current chunk, proceed next chunk
      // In case of last chunk, not append new delimiter
      if (subText.length >= len && i < digitPatterns.length - 1) {
        formattedText += delimiter;
      }
    }

    leftIndex += len;
  });
  if (shouldEliminateRest !== true) {
    formattedText += originalText.slice(leftIndex);
  }

  return formattedText;
};

// eslint-disable-next-line complexity
const InputNumber: React.FC<InputNumberProps> = (props: InputNumberProps) => {
  const { hasError, label, delimiter, digitPatterns, shouldEliminateRest, icon, type, value, onChange, ...rest } = props;
  const inputRef = React.useRef(null);
  const inputPaddingLeft = icon ? '36px' : '9px';
  const [nextCurretPosition, setNextCaretPosition] = React.useState(0);

  React.useEffect(() => {
    if (inputRef) {
      inputRef.current.setSelectionRange(nextCurretPosition, nextCurretPosition);
    }
  }, [nextCurretPosition]);

  const [prevValue, setPrevValue] = React.useState('');

  React.useEffect(() => {
    if (inputRef && inputRef.current.value) {
      inputRef.current.value = formatText(formValueToString(inputRef.current.value), type, digitPatterns, delimiter, shouldEliminateRest);
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newFormattedValue = formatText(formValueToString(e.target.value), type, digitPatterns, delimiter, shouldEliminateRest);

      const lastChar = newFormattedValue.charAt(newFormattedValue.length - 1);
      let curretPosition = (inputRef?.current?.selectionStart as number) ?? 0;

      if (prevValue.length < newFormattedValue.length) {
        curretPosition += newFormattedValue.length - prevValue.length;
      }

      if (lastChar === delimiter) {
        if (prevValue.length < newFormattedValue.length) {
          setNextCaretPosition(curretPosition + 1);
        } else if (prevValue.length > newFormattedValue.length) {
          setNextCaretPosition(curretPosition - 1);
        } else {
          newFormattedValue = newFormattedValue.substr(0, newFormattedValue.length - 1);
        }
      } else {
        setNextCaretPosition(curretPosition);
      }

      e.preventDefault();
      e.target.value = newFormattedValue;
      e.persist();
      onChange && onChange(e);
      setPrevValue(newFormattedValue);
    },
    [onChange, delimiter, digitPatterns, shouldEliminateRest, type, prevValue, setPrevValue],
  );

  const onCut = React.useCallback(() => {
    if (inputRef) {
      const curetPosition = inputRef.current.selectionStart;

      setTimeout(() => {
        setNextCaretPosition(curetPosition);
      });
    }
  }, [inputRef, setNextCaretPosition]);

  const maxLength = React.useMemo(() => {
    if (shouldEliminateRest === true) {
      const patterns = digitPatterns ?? [];
      const delimiterLength = (delimiter ?? '').length;
      let sumOfDigits = (patterns.length - 1) * delimiterLength;

      patterns.forEach((d) => {
        sumOfDigits += d;
      });

      return sumOfDigits;
    }

    return 524288;
  }, [shouldEliminateRest, digitPatterns, delimiter]);

  return (
    <InputNumberWrapper>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <Input
        ref={mergeRefs([inputRef, props.inputRef])}
        {...rest}
        type="text"
        inputMode="numeric"
        hasError={hasError}
        aria-label={label || rest.placeholder}
        value={value}
        onChange={onInputChange}
        onCut={onCut}
        maxLength={maxLength}
        paddingLeft={inputPaddingLeft}
      />
    </InputNumberWrapper>
  );
};

export default InputNumber;
