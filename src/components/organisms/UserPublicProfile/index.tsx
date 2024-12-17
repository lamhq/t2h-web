import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import styled from 'styled-components';
import Box from '@components/layouts/Box';
import SellerProfile from '@components/molecules/SellerProfile';
import { ButtonLink } from '@components/atoms/Button';
import HeroImage from '@components/organisms/HeroImage';
import OwnerHeader from './OwnerHeader';

const ProfileContainer = styled(Box)`
  width: 100%;
  position: relative;
  top: calc(100vw - 50px);
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px 20px 0px 0px;
  box-sizing: border-box;
  z-index: 1;
`;

interface UserPublicProfileProps extends WithTranslation {
  isOwner: boolean;
  isEditing: boolean;
  heroTitle: string;
  heroDescription: string;
  heroImageUrls: string[];
  heroImageFiles: File[];
  iconSrc: string;
  isVerified: boolean;
  username: string;
  numberOfListings: number;
  viewMoreUrl: string;
  description: string;
  lineUrl: string;
  facebookUrl: string;

  onEditClick: React.MouseEventHandler;
  onCancelChangeClick: React.MouseEventHandler;
  onUpdateClick: React.MouseEventHandler;
  onHeroTitleChange: (title: string) => void;
  onHeroDescriptionChange: (description: string) => void;
  onHeroImageFilesDropped: (files: File[]) => void;
  onHeroImageRemoveClick: (e: React.MouseEvent, index: number) => void;
  onIconUploaded: (icon: { src: string; file?: File }) => void;
  onDescriptionChange: (description: string) => void;
}

const UserPublicProfile: React.FC<UserPublicProfileProps> = (props: UserPublicProfileProps) => {
  const {
    t,
    isOwner,
    isEditing,
    heroTitle,
    heroDescription,
    heroImageUrls,
    heroImageFiles,
    iconSrc,
    isVerified,
    username,
    numberOfListings,
    viewMoreUrl,
    description,
    onEditClick,
    lineUrl,
    facebookUrl,
    onCancelChangeClick,
    onUpdateClick,
    onHeroTitleChange,
    onHeroDescriptionChange,
    onHeroImageFilesDropped,
    onHeroImageRemoveClick,
    onIconUploaded,
    onDescriptionChange,
  } = props;

  const isEditable = isOwner && isEditing;

  return (
    <Box>
      {isOwner === true && (
        <OwnerHeader
          t={t}
          isEditing={isEditing}
          onEditClick={onEditClick}
          onCancelChangeClick={onCancelChangeClick}
          onUpdateClick={onUpdateClick}
        />
      )}
      <HeroImage
        title={heroTitle}
        description={heroDescription}
        urls={heroImageUrls}
        isEditable={isEditable}
        onTitleChange={onHeroTitleChange}
        onDescriptionChange={onHeroDescriptionChange}
      />
      <ProfileContainer pt="12px" px={3} mb="100vw">
        <SellerProfile
          iconSrc={iconSrc}
          isVerified={isVerified}
          name={username}
          numOfListing={numberOfListings}
          linkForViewMore={viewMoreUrl}
          description={description}
          imagesSrc={heroImageUrls}
          linkForLineButton={lineUrl}
          linkForFacebookButton={facebookUrl}
          isEditable={isEditable}
          files={heroImageFiles}
          onFilesDropped={onHeroImageFilesDropped}
          onImageRemoveClick={onHeroImageRemoveClick}
          onIconUploaded={onIconUploaded}
          onDescriptionChange={onDescriptionChange}
        />
        {isEditable !== true && (
          <Box mt={3}>
            <ButtonLink variant="contact" href="/">
              {t(`View sellers details`)}
            </ButtonLink>
          </Box>
        )}
      </ProfileContainer>
    </Box>
  );
};

export default withTranslation('common')(UserPublicProfile);
