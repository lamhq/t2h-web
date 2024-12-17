import * as React from 'react';
import Link from 'next/link';
import Flex, { FlexProps } from '@components/layouts/Flex';
import Image from '@components/atoms/Image';
import { CheckCircleIcon, AddCircleOutlineIcon, CloseIcon } from '@components/atoms/IconButton';
import { Title } from '@components/atoms/Title';
import { Text, TextLink } from '@components/atoms/Text';
import { ButtonLink } from '@components/atoms/Button';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import InputImage from '@components/molecules/InputImage';
import Dropzone, { DropzoneIconVariant } from '@components/molecules/Dropzone';
import EditableText from '@components/molecules/EditableText';

interface SellerProfileProps extends FlexProps, WithTranslation {
  iconSrc: string;
  isVerified: boolean;
  name: string;
  numOfListing: number;
  description: string;

  linkForViewMore?: string;

  imagesSrc: string[];
  onImageRemoveClick?: (e: React.MouseEvent, index: number) => void;
  linkForLineButton: string;
  linkForFacebookButton: string;

  isEditable?: boolean;
  files?: File[];
  onFilesDropped?: (files: File[]) => void;
  onIconUploaded?: (value: { src: string; file: File }) => void;
  onDescriptionChange?: (val: string) => void;
}

const ItemContainer = styled.div`
  position: relative;
  width: 51px;
  height: 51px;
  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.space[2]};
  }
`;

const RemoveIconContainer = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 18px;
  height: 18px;

  border-radius: 50%;
  background-color: #ff3c35;
`;

const IndicatorContainer = styled(Flex)`
  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.space[3]};
  }
`;

const Indicator = (props: { num: number; unit: string; linkForIcon?: string }) => {
  const { num, unit, linkForIcon } = props;

  return (
    <IndicatorContainer flexDirection="column" alignItems="center">
      <Flex justifyContent="center" alignItems="center">
        <Text my={0} color="primary" textAlign="center" fontWeight="bold" fontFamily="secondary">
          {num}
        </Text>
        {linkForIcon && (
          <Flex ml="2px">
            <Link href={linkForIcon}>
              <AddCircleOutlineIcon size="18px" />
            </Link>
          </Flex>
        )}
      </Flex>
      <Text my={0} variant="small" color="#666666" textAlign="center" fontFamily="secondary">
        {unit}
      </Text>
    </IndicatorContainer>
  );
};

const StyledButtonLink = styled(ButtonLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const SnsButtonsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: 16.8px;
`;

const SnsButton = (props: { color: string; iconSrc: string; link: string; text: string }) => {
  const { color, iconSrc, link, text } = props;
  const width = color === '#00B900' ? '28px' : '20px';

  return (
    <StyledButtonLink href={link} backgroundColor={color} color="white">
      <Image width={width} height="auto" src={iconSrc} />
      <Flex ml="7px">
        <Text my={0} color="white" variant="small" fontFamily="secondary">
          {text}
        </Text>
      </Flex>
    </StyledButtonLink>
  );
};

const SellerProfile: React.FC<SellerProfileProps> = (props: SellerProfileProps) => {
  const {
    t,
    iconSrc,
    isVerified,
    name,
    numOfListing,
    description,
    linkForViewMore,
    imagesSrc,
    linkForLineButton,
    linkForFacebookButton,
    isEditable,
    files,
    onFilesDropped,
    onImageRemoveClick,
    onIconUploaded,
    onDescriptionChange,
  } = props;

  return (
    <Flex flexDirection="column" alignItems="center">
      {isEditable === true ? (
        <InputImage width={'80px'} height={'80px'} value={{ src: iconSrc }} onChange={onIconUploaded} />
      ) : (
        <Image width={'80px'} height={'80px'} src={iconSrc} shape="circle" />
      )}
      <Flex mt="10px" alignItems="center" justifyContent="center">
        {isVerified === true && <CheckCircleIcon size="18px" color="success" />}
        <Title ml="3px" my={0} fontSize="19px" lineHeight="27px" letterSpacing="0.09px" color="label">
          {name}
        </Title>
      </Flex>
      <Flex mt="12px" justifyContent="center">
        <Indicator num={numOfListing} unit={t('Listings')} />
      </Flex>

      <Flex mt="11px" width="100%">
        <EditableText
          defaultValue={description}
          onChange={onDescriptionChange}
          isEditable={isEditable}
          isEditIconVisible={false}
          isMultiline={true}
          inputProps={{ fontFamily: 'secondary', height: '100%', overflowY: 'scroll', mt: 0, mb: 0 }}
          containerProps={{
            py: 2,
            px: 2,
            border: isEditable ? '1px solid #dddddd' : '',
            width: '100%',
          }}
        />
      </Flex>
      {isEditable !== true && (
        <Flex mt={3} display={{ _: 'block', md: 'none' }}>
          <TextLink href={linkForViewMore} my={0}>
            {t(`View more`)}
          </TextLink>
        </Flex>
      )}
      <Flex mt={3} width="100%">
        {imagesSrc.map((src, index) => {
          return (
            <ItemContainer key={index}>
              <Image src={src} borderRadius="6px" />
              {isEditable === true && (
                <RemoveIconContainer>
                  <CloseIcon color="white" size="18px" onClick={(e) => onImageRemoveClick && onImageRemoveClick(e, index)} />
                </RemoveIconContainer>
              )}
            </ItemContainer>
          );
        })}
        {isEditable === true && (
          <ItemContainer>
            <Dropzone
              variant={DropzoneIconVariant.Small}
              value={files}
              onDrop={onFilesDropped}
              acceptedFileTypes={['image/gif', 'image/jpeg', 'image/jpg', 'image/png']}
              width="100%"
              height="100%"
            />
          </ItemContainer>
        )}
      </Flex>

      {/* todo: change this props */}
      {isEditable !== true && (
        <SnsButtonsContainer>
          <SnsButton color="#00B900" iconSrc="/static/images/icon/line.png" link={linkForLineButton} text={t('Add friend')} />
          <SnsButton color="#3B5998" iconSrc="/static/images/icon/facebook.png" link={linkForFacebookButton} text={'Follow us'} />
        </SnsButtonsContainer>
      )}
    </Flex>
  );
};

SellerProfile.displayName = 'SellerProfile';

SellerProfile.defaultProps = {
  imagesSrc: [],
  files: [],
};

export default withTranslation('common')(SellerProfile);
