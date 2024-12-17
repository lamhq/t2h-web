import React from 'react';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { Text, TextLink } from '@components/atoms/Text';
import { ErrorOutlineIcon } from '@components/atoms/IconButton';
import Image from '@components/atoms/Image';

interface FormHelperProps {
  description: string;
  imageUrl?: string;
  linkText?: string;
  linkUrl?: string;
}

const FormHelper = ({ description, imageUrl, linkText, linkUrl }: FormHelperProps) => {
  return (
    <Flex>
      <Box display={{ _: 'none', md: 'block' }}>
        <ErrorOutlineIcon size="20px" color="placeholder" />
      </Box>
      <Flex ml="6px" mt={{ _: 3, md: 0 }} flexDirection="column">
        <Text mt={0} mb={0} variant="small" lineHeight="22px" color="placeholder" fontFamily="secondary">
          {description}
        </Text>
        {imageUrl && (
          <Box width="100%" mt="9px" display={{ _: 'none', md: 'block' }}>
            <Image width="100%" src={imageUrl} />
          </Box>
        )}
        <Box display={{ _: 'block', md: 'none' }}>
          <TextLink href={linkUrl} mt={0} mb={0} color="link" fontFamily="secondary">
            {linkText}
          </TextLink>
        </Box>
      </Flex>
    </Flex>
  );
};

export default FormHelper;
