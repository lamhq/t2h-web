import React from 'react';
import styled from 'styled-components';
import { mergeRefs } from '@common/utils/hooks';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import Image from '@components/atoms/Image';
import CheckBox, { CheckBoxProps } from '@components/molecules/CheckBox';

const PaymentTypeContainer = styled(Flex)`
  height: 44px;
  padding: 0px 16px;

  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid #dddddd;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;

  &:not(:first-child) {
    margin-top: 8px;
  }
`;

interface PaymentTypeProps extends CheckBoxProps {
  name: string;
  label: string;
  logo: string;
}

const PaymentType = React.forwardRef((props: PaymentTypeProps, ref: React.Ref<HTMLInputElement>) => {
  const { name, label, logo, ...rest } = props;

  const checkRef = React.useRef(null);
  const mergedRef = mergeRefs([ref, checkRef]);

  const onClickContainer = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      checkRef && checkRef.current.click();
    },
    [checkRef],
  );

  return (
    <PaymentTypeContainer alignItems="center" onClick={onClickContainer}>
      <Box>
        <CheckBox {...rest} ref={mergedRef} id={name} name={name} label={label} />
      </Box>
      <Box ml="auto" mr={0}>
        <Image src={logo} width="24px" height="15px" />
      </Box>
    </PaymentTypeContainer>
  );
});

PaymentType.displayName = 'PaymentType';

export default PaymentType;
