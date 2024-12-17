import * as React from 'react';
import styled from 'styled-components';
import { layout, position, LayoutProps, PositionProps } from 'styled-system';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import { PhotoCameraIcon } from '@components/atoms/IconButton';
import Box from '@components/layouts/Box';

const ListingItemWrapper = styled.div<LayoutProps & { hasBorder?: boolean }>`
  ${layout}
  border: ${({ hasBorder }) => (hasBorder ? 'solid 1px #E1E1E1' : 'none')};
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: row;
`;

const Image = styled.img<LayoutProps>`
  ${layout}
  object-fit: cover;
  border-radius: 6px;
  margin-right: 4px;
  flex: 0 0 auto;
`;

const Description = styled(Box)`
  flex: 1;
  box-sizing: border-box;
`;

Description.defaultProps = {
  px: 3,
  py: 2,
};

const StyledTitle = styled(Title)`
  overflow-wrap: break-word;
  overflow: hidden;
  height: 52px;
  display: flex;
  justify-content: space-between;
`;

StyledTitle.defaultProps = {
  textAlign: 'left',
  fontSize: '13px',
  lineHeight: '16px',
  my: 0,
};

const DetailsContainer = styled.div`
  height: 35px;
  overflow: hidden;
`;

const Tags = styled(Text)``;

Tags.defaultProps = {
  color: '#989898',
  fontSize: '14px',
  lineHeight: '22px',
  fontFamily: 'secondary',
  mt: '14px',
  mb: '6px',
};

const Price = styled(Text)``;

Price.defaultProps = {
  color: '#333333',
  fontSize: '20px',
  fontWeight: 'bold',
  lineHeight: '28px',
  fontFamily: 'secondary',
  my: 0,
};

const AddOn = styled.div<PositionProps>`
  ${position};
  position: absolute;
`;

const TagSeparator = () => <>&nbsp;&nbsp;|&nbsp;&nbsp;</>;

const Badge = styled.div`
  border-radius: 3px;
  background-color: #222;
  color: #fff;
  padding: 3px 5px;
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const PhotoCount: React.FC<{}> = (props: React.PropsWithChildren<{}>) => (
  <Badge>
    <PhotoCameraIcon color="white" size="14px" />
    &nbsp;
    {props.children}
  </Badge>
);

interface ListingItemProps extends React.HTMLAttributes<HTMLElement>, LayoutProps {
  imageUrl?: string;
  title: string;
  detail?: string;
  tags?: string[];
  price: string;
  hasBorder?: boolean;
  photoCount?: number;
  leftTopElement?: React.ReactNode;
  rightTopElement?: React.ReactNode;
  rightBottomElement?: React.ReactNode;
}

export const ListingItemBig: React.FC<ListingItemProps> = (props: ListingItemProps) => {
  const { imageUrl, title, detail, tags, price, photoCount, leftTopElement, rightTopElement, rightBottomElement, ...rest } = props;

  return (
    <ListingItemWrapper {...rest}>
      <Image src={imageUrl} alt={title} size={props.height} />
      {leftTopElement && (
        <AddOn left="3px" top="3px">
          {leftTopElement}
        </AddOn>
      )}
      {photoCount !== undefined && (
        <AddOn left="3px" top="3px">
          <PhotoCount>{photoCount}</PhotoCount>
        </AddOn>
      )}
      <Description>
        <Box height="54px">
          <StyledTitle as="h3" fontSize="19px" lineHeight="27px">
            {title}
            <Box ml="auto">{rightTopElement}</Box>
          </StyledTitle>
        </Box>
        <Box height="40px">
          {detail !== undefined && (
            <DetailsContainer>
              <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                {detail}
              </Text>
            </DetailsContainer>
          )}
        </Box>
        <Tags>
          {tags.map((item, index) => (
            <span key={index}>
              {item}
              {index < tags.length - 1 && <TagSeparator />}
            </span>
          ))}
        </Tags>
        <Box mt="auto">
          <Price>{price}</Price>
        </Box>
      </Description>
      {rightBottomElement && (
        <AddOn right="3px" bottom="3px">
          {rightBottomElement}
        </AddOn>
      )}
    </ListingItemWrapper>
  );
};

ListingItemBig.defaultProps = {
  height: '180px',
};

export default ListingItemBig;
