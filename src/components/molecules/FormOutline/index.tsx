import React from 'react';
import Flex from '@components/layouts/Flex';
import { SubTitle } from '@components/atoms/Title';

interface FormOutlineProps {
  outline: string;
  icon?: JSX.Element;
}

const FormOutline = ({ outline, icon }: FormOutlineProps) => {
  return (
    <Flex>
      <SubTitle mt={0} mb={0} fontSize="19px" lineHeight="27px" fontWeight="bold" textAlign="left">
        {outline}
      </SubTitle>
      {icon && (
        <Flex ml="auto" mr={0} alignItems="center" display={{ _: 'block', md: 'none' }}>
          {icon}
        </Flex>
      )}
    </Flex>
  );
};

FormOutline.displayName = 'FormOutline';

export default FormOutline;
