import React from 'react';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { FileApi, UserApi, ShopApi } from '@services/apis';
import { UserResponse, ShopResponse, FileCategory, FilePermission, FileResponse } from '@services/types';
import { ImageData } from '@components/molecules/InputImages';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import UserPublicProfile from '@components/organisms/UserPublicProfile';
import { uploadImageIfNotUploaded } from '@services/facades/file';
import { safeKey } from '@common/utils';

interface UserPublicProfileContainerProps extends WithTranslation {
  userApi: ReturnType<typeof UserApi>;
  fileApi: ReturnType<typeof FileApi>;
  shopApi: ReturnType<typeof ShopApi>;
  isOwner: boolean;
  defaultUser: UserResponse;
  defaultShop?: ShopResponse;
}

const UserPublicProfileContainer = (props: UserPublicProfileContainerProps) => {
  const { t, userApi, fileApi, shopApi, isOwner, defaultUser, defaultShop } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const [user, setUser] = React.useState(defaultUser);
  const [shop, setShop] = React.useState(defaultShop);
  const [heroTitle, setHeroTitle] = React.useState(defaultShop?.title);
  const [heroDescription, setHeroDescription] = React.useState(defaultShop?.description);
  const [description, setDescription] = React.useState(defaultUser.description);
  const [isEditing, setIsEditing] = React.useState(false);

  console.log(defaultShop);

  const [heroImages, setHeroImages] = React.useState<ImageData[]>(
    defaultShop?.images.map((f: FileResponse) => ({ src: f.url, hashId: f.hashId })) || [],
  );

  const onHeroImageFilesDropped = React.useCallback(
    (files: File[]) => {
      setHeroImages((images) => {
        const newFile = files[files.length - 1];
        const newImage = { file: newFile, src: URL.createObjectURL(newFile) };

        return [...images, newImage];
      });
    },
    [setHeroImages],
  );
  const onHeroImageRemoveClick = React.useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      const img = heroImages[safeKey(index)];

      if (img.file && img.src) {
        URL.revokeObjectURL(img.src);
      }

      setHeroImages(heroImages.filter((_, i) => i !== index));
    },
    [heroImages, setHeroImages],
  );

  const [userIcon, setUserIcon] = React.useState<ImageData>({ src: defaultUser.profileImageUrl });
  const onIconUploaded = React.useCallback(
    ({ src, file }) => {
      setUserIcon({ src: src, file: file });
    },
    [setUserIcon],
  );

  const onEditClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsEditing(true);
    },
    [setIsEditing],
  );
  const onCancelChangeClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsEditing(false);
    },
    [setIsEditing],
  );
  const onUpdateClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      setGlobalSpinner(true);

      try {
        const [newIcon, newHeroImages] = await Promise.all([
          uploadImageIfNotUploaded(fileApi, userIcon, {
            category: FileCategory.Other,
            permission: FilePermission.Public,
          }),
          Promise.all(
            heroImages.map(async (image: ImageData) =>
              uploadImageIfNotUploaded(fileApi, image, { category: FileCategory.Other, permission: FilePermission.Public }),
            ),
          ),
        ]);

        setUserIcon(newIcon);
        setHeroImages(newHeroImages);

        const newUser = await userApi.updateUser({ profileImageUrl: newIcon.src, description: description });
        const newShop = await shopApi.updateShop(shop.hashId, {
          title: heroTitle,
          description: heroDescription,
          heroImageFileHashId: newHeroImages[0]?.hashId,
          imageHashIds: newHeroImages.map((img) => img.hashId),
        });

        setUser(newUser);
        setShop(newShop);
        setHeroTitle(newShop.title);
        setHeroDescription(newShop.description);
        setHeroImages(newShop.images.map((f: FileResponse) => ({ src: f.url, hashId: f.hashId })));
        setIsEditing(false);
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [
      t,
      fileApi,
      shopApi,
      userApi,
      setGlobalSpinner,
      setGlobalSnackbar,
      setIsEditing,
      setUser,
      setShop,
      setUserIcon,
      setHeroImages,
      setHeroTitle,
      setHeroDescription,
      description,
      heroDescription,
      heroImages,
      heroTitle,
      shop,
      userIcon,
    ],
  );

  const heroImageUrls = React.useMemo(() => heroImages.map((image) => image.src), [heroImages]);
  const heroImageFiles = React.useMemo(() => heroImages.map((image) => image.file), [heroImages]);

  const username = user.displayName;
  const isVerified = user.isEmailVerified || user.isMobileVerified;
  const numOfListings = 42;
  const viewMoreUrl = '/';
  const lineUrl = '/';
  const facebookUrl = '/';

  return (
    <UserPublicProfile
      isOwner={isOwner}
      isEditing={isEditing}
      heroTitle={heroTitle}
      heroDescription={heroDescription}
      heroImageUrls={heroImageUrls}
      heroImageFiles={heroImageFiles}
      iconSrc={userIcon.src}
      isVerified={isVerified}
      username={username}
      numberOfListings={numOfListings}
      viewMoreUrl={viewMoreUrl}
      description={description}
      lineUrl={lineUrl}
      facebookUrl={facebookUrl}
      onEditClick={onEditClick}
      onCancelChangeClick={onCancelChangeClick}
      onUpdateClick={onUpdateClick}
      onHeroTitleChange={setHeroTitle}
      onHeroDescriptionChange={setHeroDescription}
      onHeroImageFilesDropped={onHeroImageFilesDropped}
      onHeroImageRemoveClick={onHeroImageRemoveClick}
      onIconUploaded={onIconUploaded}
      onDescriptionChange={setDescription}
    />
  );
};

export default withTranslation('common')(UserPublicProfileContainer);
