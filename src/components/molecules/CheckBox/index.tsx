import React from 'react';
import styled from 'styled-components';
import { TextLabel } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import { CheckBoxOutlineBlankIcon, CheckBoxIcon } from '@components/atoms/IconButton';
import { mergeRefs } from '@common/utils/hooks';

export interface CheckBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'> {
  label?: string;
  defaultValue?: boolean;
}

const CheckBoxElement = styled.input`
  display: none;
`;

const Label = styled.label`
  cursor: pointer;
`;

const CheckBox = React.forwardRef((props: CheckBoxProps, ref: React.Ref<HTMLInputElement>) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { label, onChange, defaultValue, ...rest } = props;
  const [isChecked, setIsChecked] = React.useState(!!defaultValue);

  const checkBoxRef = React.useRef(null);
  const mergedRef = mergeRefs([ref, checkBoxRef]);
  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      checkBoxRef && checkBoxRef.current.click();
      setIsChecked((isChecked) => !isChecked);
    },
    [checkBoxRef, setIsChecked],
  );

  return (
    <React.Fragment>
      <CheckBoxElement {...rest} ref={mergedRef} type="checkbox" checked={isChecked} readOnly={!onChange} onChange={onChange} />
      <Flex alignItems="center">
        {props.checked ?? isChecked ? (
          <CheckBoxIcon size="18px" onClick={onClick} />
        ) : (
          <CheckBoxOutlineBlankIcon size="18px" onClick={onClick} />
        )}
        {label && label.length > 0 && (
          <Label htmlFor={props.id} onClick={onClick}>
            <TextLabel ml={1} fontFamily="secondary">
              {label}
            </TextLabel>
          </Label>
        )}
      </Flex>
    </React.Fragment>
  );
});

CheckBox.displayName = 'CheckBox';

export default CheckBox;
