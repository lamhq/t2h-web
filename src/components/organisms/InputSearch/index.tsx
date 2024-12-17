import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CancelIcon, SearchIcon } from '@components/atoms/IconButton';
import InputText, { InputTextProps } from '@components/molecules/InputText';
import { mergeRefs } from '@common/utils/hooks';

export interface InputSearchProps extends Omit<InputTextProps, 'helperText' | 'hasError' | 'icon' | 'isPlainText'> {
  onCancel?: () => void;
}

const InputSearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CancelIconWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  height: 38px;
  width: 38px;
  top: 0px;
  right: 0px;

  div {
    position: relative;
    top: 10px;
    left: 9px;
  }
`;

const InputSearch: React.FC<InputSearchProps> = React.forwardRef(
  (props: InputSearchProps, ref: React.MutableRefObject<HTMLInputElement>) => {
    const { onChange, onCancel, ...rest } = props;
    const [isCancelButtonHidden, setIsCancelButtonHidden] = useState(true);
    const inputRef = useRef(null);
    const handleChange = useCallback(
      (e) => {
        setIsCancelButtonHidden(e.target.value.length === 0);
        onChange && onChange(e);
      },
      [onChange],
    );
    const handleCancel = useCallback(() => {
      onCancel && onCancel();
      setIsCancelButtonHidden(inputRef.current.value.length === 0);
    }, [onCancel]);

    // Control cancel button visibility
    useEffect(() => {
      if (typeof rest.value === 'string') {
        setIsCancelButtonHidden(rest.value.length === 0);
        inputRef.current.focus();
      }
    }, [rest.value]);

    return (
      <InputSearchWrapper>
        <InputText
          ref={mergeRefs([inputRef, ref])}
          {...rest}
          onChange={handleChange}
          icon={<SearchIcon color="placeholder" size="18px" />}
        />
        {!isCancelButtonHidden && (
          <CancelIconWrapper onClick={handleCancel}>
            <CancelIcon size="18px" color="placeholder" />
          </CancelIconWrapper>
        )}
      </InputSearchWrapper>
    );
  },
);

InputSearch.displayName = 'InputSearch';

export default InputSearch;
