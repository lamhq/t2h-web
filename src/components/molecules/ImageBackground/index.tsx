import * as React from 'react';
import styled from 'styled-components';
import { border, background, BorderProps, BackgroundProps } from 'styled-system';
import Box from '@components/layouts/Box';

const StyledImage = styled.div<BackgroundProps & BorderProps>`
  position: relative;
  width: 100%;
  height: 100%;
  ${background};
  ${border}
`;

const Mask = styled.div<BorderProps & BackgroundProps>`
  position: relative;
  width: 100%;
  height: 100%;
  ${border};
  ${background};
`;

interface ImageBackgroundProps extends BorderProps, BackgroundProps {
  children: React.ReactNode;
  imageSrc: BackgroundProps['backgroundImage'];
  imageSize: BackgroundProps['backgroundSize'];
  imageRepeat: BackgroundProps['backgroundRepeat'];
}

const ImageBackground = (props: ImageBackgroundProps) => {
  const { children, imageSrc, imageSize, imageRepeat, borderRadius, ...maskProps } = props;

  return (
    <StyledImage backgroundImage={`url(${imageSrc})`} backgroundSize={imageSize} backgroundRepeat={imageRepeat} borderRadius={borderRadius}>
      <Mask {...maskProps}>
        <Box width="100%" height="100%">
          {children}
        </Box>
      </Mask>
    </StyledImage>
  );
};

export default ImageBackground;
