import React from 'react';
import styled from 'styled-components';
import HorizontalCollection from '@components/atoms/HorizontalCollection';
import Image from '@components/atoms/Image';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { safeKey } from '@common/utils';

interface PreviewImagesProps {
  srcs: string[];
  onSelect?: (index: number) => void;
}

const SubImage = styled(Image)`
  border-radius: 8px;
  cursor: pointer;
`;

const PreviewImages: React.FC<PreviewImagesProps> = (props: PreviewImagesProps) => {
  const { srcs, onSelect } = props;

  const [selectedImage, setSelectedImage] = React.useState(0);
  const onImageClick = React.useCallback(
    (index: number) => {
      setSelectedImage(index);
      onSelect && onSelect(index);
    },
    [setSelectedImage, onSelect],
  );

  return (
    <Flex flexDirection="column">
      <Box height={{ _: '180px', md: '377px' }}>
        <Image objectFit="cover" src={srcs[safeKey(selectedImage)]} width="100%" height="100%" />
      </Box>
      <Flex mt={{ _: 1, md: 2 }} justifyContent={{ _: 'center', md: 'flex-start' }}>
        <HorizontalCollection width={{ _: '280px', md: 1 }} px={3}>
          {srcs.map((src, index) => (
            <Box key={index} width={{ _: '60px', md: '80px' }} height={{ _: '60px', md: '80px' }}>
              <SubImage
                src={src}
                width={{ _: '60px', md: '80px' }}
                height={{ _: '60px', md: '80px' }}
                objectFit="cover"
                onClick={() => onImageClick(index)}
              />
            </Box>
          ))}
        </HorizontalCollection>
      </Flex>
    </Flex>
  );
};

export default PreviewImages;
