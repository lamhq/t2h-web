import React from 'react';
import styled from 'styled-components';
import { ReactSortable } from 'react-sortablejs';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import Dropzone from '@components/molecules/Dropzone';
import ImagePreview from '@components/molecules/ImagePreview';
import { ImageData } from '@components/molecules/InputImages';
import { useSortableInputImagesState } from './hooks';

interface SortableInputImagesProps {
  ref?: React.Ref<HTMLInputElement>;
  images: ImageData[];
  onChange?: (images: ImageData[]) => void;
  name?: string;

  maximumNumber?: number;
  imageSize?: string;
}

const FlexSortableImagesContainer = styled(ReactSortable)`
  width: auto;
  display: flex;
  flex-wrap: wrap;
  & > *:not(:first-child) {
    margin-left: ${({ theme }) => theme.space[2]};
  }
  overflow-x: hidden;
  overflow-y: hidden;

  img {
    object-fit: cover;
  }
`;

const SortableImageWrapper = styled(Box)`
  display: flex;
  box-sizing: border-box;
  align-self: center;
  justify-self: center;

  &.sortable-ghost {
    background-color: #c8ebfb;
  }
`;

const FlexSortableInputImages: React.FC<SortableInputImagesProps> = React.forwardRef(
  (props: SortableInputImagesProps, ref: React.Ref<HTMLInputElement>) => {
    const { images, onChange, maximumNumber, imageSize } = props;

    const { onDrop, onRemove, onSortStart, onSortEnd, isDropzoneVisible, files } = useSortableInputImagesState(
      images,
      onChange,
      maximumNumber,
    );

    return (
      <Flex flexWrap="wrap">
        <FlexSortableImagesContainer list={images} setList={onChange} animation={200} onStart={onSortStart} onEnd={onSortEnd}>
          {images.map((image, index) => {
            return (
              <SortableImageWrapper key={index} width={imageSize} height={imageSize}>
                <ImagePreview src={image.src} onRemove={() => onRemove(index)} />
              </SortableImageWrapper>
            );
          })}
        </FlexSortableImagesContainer>
        {isDropzoneVisible && (
          <Box mt={3} ml={images.length > 0 ? 2 : 0}>
            <Dropzone
              ref={ref}
              width={imageSize}
              height={imageSize}
              acceptedFileTypes={['image/gif', 'image/jpeg', 'image/jpg', 'image/png']}
              value={files}
              onDrop={onDrop}
            />
          </Box>
        )}
      </Flex>
    );
  },
);

FlexSortableInputImages.displayName = 'FlexSortableInputImages';

FlexSortableInputImages.defaultProps = {
  imageSize: '120px',
};

export default FlexSortableInputImages;
