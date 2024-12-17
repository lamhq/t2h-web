import React from 'react';
import InputLabel from '@components/atoms/InputLabel';
import InputHelperText from '@components/atoms/InputHelperText';
import InputNumber, { InputNumberProps } from './InputNumber';

export const InputThaiBankAccount = (props: InputNumberProps) => {
  const { label, helperText, hasError } = props;

  return (
    <React.Fragment>
      {label && label.length > 0 && <InputLabel>{label}</InputLabel>}
      <InputNumber type="number" digitPatterns={[3, 1, 5, 1]} delimiter=" " shouldEliminateRest={true} {...props} />
      {helperText && helperText.length > 0 && <InputHelperText hasError={hasError}>{helperText}</InputHelperText>}
    </React.Fragment>
  );
};

export default InputThaiBankAccount;
