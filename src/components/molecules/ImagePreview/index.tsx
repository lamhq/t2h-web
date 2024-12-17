import React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Image from '@components/atoms/Image';
import { CloseIcon } from '@components/atoms/IconButton';
import { Text } from '@components/atoms/Text';
import { layout, LayoutProps } from 'styled-system';

const ImagePreviewContainer = styled.div`
  position: relative;
`;

const StyledImage = styled(Image)<LayoutProps>`
  ${layout}
  border-radius: 6px;
`;

const CloseBox = styled(Flex)`
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 0 6px 0 6px;
  background-color: rgba(44, 44, 44, 0.66);
  cursor: pointer;
`;

const ImageTitle = styled(Text)`
  position: absolute;
  top: 14px;
  border-radius: 0 6px 6px 0;
  background-color: #1d3461;
  box-sizing: boder-box;
  padding-left: 4px;
  padding-right: 4px;
`;

interface ImagePreviewProps {
  src: string;
  alt?: string;
  title?: string;
  height?: LayoutProps['maxHeight'];
  width?: LayoutProps['maxWidth'];
  onRemove?: (src: string) => void;
}

const ImagePreview = (props: ImagePreviewProps) => {
  const { src, alt, title, height, width, onRemove } = props;

  const onCloseClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onRemove && onRemove(src);
    },
    [onRemove, src],
  );

  return (
    <ImagePreviewContainer>
      <StyledImage src={src} alt={alt} maxHeight={height} maxWidth={width} objectPosition="50% 0%" />
      <CloseBox alignItems="center" justifyContent="center" onClick={onCloseClick}>
        <CloseIcon size="24px" color="white" />
      </CloseBox>
      {title && (
        <ImageTitle my={0} variant="small" color="white" lineHeight="26px">
          {title}
        </ImageTitle>
      )}
    </ImagePreviewContainer>
  );
};

export default ImagePreview;
