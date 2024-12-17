import React from 'react';
import InputHelperText from '@components/atoms/InputHelperText';
import InputLabel from '@components/atoms/InputLabel';
import { PhoneIcon } from '@components/atoms/IconButton';
import InputNumber, { InputNumberProps } from './InputNumber';

const InputThaiMobilePhone = React.forwardRef((props: InputNumberProps, ref: React.MutableRefObject<HTMLInputElement>) => {
  const { label, helperText, hasError } = props;

  return (
    <React.Fragment>
      {label && label.length > 0 && <InputLabel>{label}</InputLabel>}
      <InputNumber
        inputRef={ref}
        type="number"
        digitPatterns={[2, 4, 4]}
        delimiter=" "
        shouldEliminateRest={true}
        icon={<PhoneIcon size="16px" />}
        {...props}
      />
      {helperText && helperText.length > 0 && <InputHelperText hasError={hasError}>{helperText}</InputHelperText>}
    </React.Fragment>
  );
});

InputThaiMobilePhone.displayName = 'InputThaiMobilePhone';

export default InputThaiMobilePhone;
