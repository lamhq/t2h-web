import React from 'react';
import InputLabel from '@components/atoms/InputLabel';
import InputHelperText from '@components/atoms/InputHelperText';
import InputNumber, { InputNumberProps } from './InputNumber';

const InputThaiNationalId = React.forwardRef((props: InputNumberProps, ref: any) => {
  const { label, helperText, hasError } = props;

  return (
    <React.Fragment>
      {label && label.length > 0 && <InputLabel>{label}</InputLabel>}
      <InputNumber inputRef={ref} type="number" digitPatterns={[1, 4, 5, 2, 1]} delimiter=" " shouldEliminateRest={true} {...props} />
      {helperText && helperText.length > 0 && <InputHelperText hasError={hasError}>{helperText}</InputHelperText>}
    </React.Fragment>
  );
});

InputThaiNationalId.displayName = 'InputThaiNationalId';

export default InputThaiNationalId;
