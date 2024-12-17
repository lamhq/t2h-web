import * as React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import SwipeableElements from '@components/molecules/SwipeableElements';
import Image from '@components/atoms/Image';
import EditableText from '@components/molecules/EditableText';
import Indicator from '@components/molecules/Indicator';

const HeroImageContainer = styled.div`
  position: absolute;
  width: 100%;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  z-index: 0;
`;

interface HeroImageProps {
  title: string;
  description: string;
  urls: string[];
  isEditable: boolean;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
}

const HeroImage = ({ title, description, urls, isEditable, onTitleChange, onDescriptionChange }: HeroImageProps) => {
  const [position, setPosition] = React.useState(0);

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const onTitleEditIconClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsEditingTitle((isEditing) => !isEditing);
    },
    [setIsEditingTitle],
  );
  const onTitleBoxClick = React.useCallback(() => {
    if (isEditingTitle === false) {
      setIsEditingTitle(true);
    }
  }, [isEditingTitle, setIsEditingTitle]);

  const [isEditingDescription, setIsEditingDescription] = React.useState(false);
  const onDescriptionEditIconClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsEditingDescription((isEditing) => !isEditing);
    },
    [setIsEditingDescription],
  );

  const onDescriptionBoxClick = React.useCallback(() => {
    if (isEditingDescription === false) {
      setIsEditingDescription(true);
    }
  }, [isEditingDescription, setIsEditingDescription]);

  return (
    <Box position="relative" width="100%">
      <HeroImageContainer>
        <Box position="absolute" top={0} right={0} bottom={0} left={0} overflow="hidden">
          <SwipeableElements width="100%" height="100%" onChangePosition={setPosition}>
            {urls.map((url, index) => (
              <Image key={index} width="100%" height="100%" src={url} shape="rect" objectFit="cover" />
            ))}
          </SwipeableElements>
        </Box>
        <Box position="absolute" top="93px" width="100%">
          <Flex flexDirection="column" alignItems="center" mx="23px">
            <EditableText
              defaultValue={title}
              onChange={onTitleChange}
              isEditIconVisible={isEditable}
              isEditable={isEditable && isEditingTitle}
              onEditIconClick={onTitleEditIconClick}
              isMultiline={true}
              inputProps={{
                mt: 0,
                mb: 0,
                ml: 2,
                mr: 3,
                color: 'white',
                fontSize: '28px',
                lineHeight: '38px',
                letterSpacing: '0.14px',
                fontFamily: 'secondary',
                textAlign: 'center',
              }}
              containerProps={{
                border: isEditable ? '1px solid #ffffff' : '',
                width: '100%',
                onClick: onTitleBoxClick,
              }}
            />
            <EditableText
              defaultValue={description}
              onChange={onDescriptionChange}
              isEditIconVisible={isEditable}
              isEditable={isEditable && isEditingDescription}
              onEditIconClick={onDescriptionEditIconClick}
              isMultiline={true}
              inputProps={{ mt: 0, mb: 0, ml: 2, mr: 3, color: 'white', textAlign: 'center', fontFamily: 'secondary' }}
              containerProps={{ border: isEditable ? '1px solid #ffffff' : '', width: '100%', onClick: onDescriptionBoxClick }}
            />
          </Flex>
        </Box>
        <Box position="absolute" bottom="68px" width="100%">
          <Flex justifyContent="center">
            <Indicator index={position} number={urls.length} />
          </Flex>
        </Box>
      </HeroImageContainer>
    </Box>
  );
};

export default HeroImage;
