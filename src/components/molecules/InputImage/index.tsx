import * as React from 'react';
import styled from 'styled-components';
import Image from '@components/atoms/Image';
import { PhotoCameraIcon } from '@components/atoms/IconButton';
import { mergeRefs } from '@common/utils/hooks';

type ImageDate = { src: string; file?: File };

interface InputImageProps {
  ref?: React.Ref<HTMLInputElement>;
  name?: string;
  placeHolder?: string;
  width?: string;
  height?: string;
  value?: ImageDate;
  defaultValue?: ImageDate;
  onChange?: (value: ImageDate) => void;
}

const InputImageContainer = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

const EmptyImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 100%;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : '')};
`;

const ChangeImageButton = styled.div<{ onClick: React.MouseEventHandler<HTMLElement> }>`
  position: absolute;
  right: 4px;
  bottom: 4px;

  width: 28px;
  height: 28px;
  background-color: #ffffff;
  border-radius: 100%;

  box-shadow: 0px 2px 8px 0 rgba(0, 0, 0, 0.14);

  cursor: ${({ onClick }) => (onClick ? 'pointer' : '')};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileInputForm = styled.input<{ ref?: React.Ref<HTMLInputElement> }>`
  width: 0;
  height: 0;
  visibility: hidden;
`;

const InputImage: React.FC<InputImageProps> = React.forwardRef(
  ({ value, defaultValue, name, onChange, placeHolder, width, height }: InputImageProps, ref: React.MutableRefObject<HTMLInputElement>) => {
    const [currentValue, setCurrentValue] = React.useState(value || defaultValue);
    const fileInputRef = React.useRef(null);
    const onChangeImageButtonClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (onChange && fileInputRef) {
          fileInputRef.current.click();
        }
      },
      [onChange],
    );
    const onFileInputChange = React.useCallback(
      (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const files = Array.from(target.files);

        if (files.length > 0) {
          const src = window.URL.createObjectURL(files[0]);

          onChange && onChange({ src, file: files[0] });
        }
      },
      [onChange],
    );

    React.useEffect(() => {
      setCurrentValue(value);
    }, [value]);

    return (
      <InputImageContainer width={width} height={height}>
        {currentValue ? (
          <Image style={{ cursor: 'pointer' }} src={currentValue.src} shape="circle" onClick={onChange ? onChangeImageButtonClick : null} />
        ) : (
          <EmptyImage onClick={onChange ? onChangeImageButtonClick : null}>{placeHolder}</EmptyImage>
        )}
        <ChangeImageButton onClick={onChange ? onChangeImageButtonClick : null}>
          <PhotoCameraIcon />
        </ChangeImageButton>
        <FileInputForm ref={mergeRefs([ref, fileInputRef])} name={name} type="file" accept="image/*" onChange={onFileInputChange} />
      </InputImageContainer>
    );
  },
);

InputImage.displayName = 'InputImage';

InputImage.defaultProps = {
  width: '120px',
  height: '120px',
};

export default InputImage;
