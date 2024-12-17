import * as React from 'react';
import styled from 'styled-components';
import {
  layout,
  position,
  PositionProps,
  LayoutProps,
  ColorProps,
  SpaceProps,
  TypographyProps,
  color,
  space,
  typography,
} from 'styled-system';
import { Text } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import { PhotoCameraIcon } from '@components/atoms/IconButton';

const Container = styled.div<LayoutProps>`
  ${layout}
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Image = styled.img<LayoutProps>`
  ${layout}
  object-fit: cover;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const Main = styled.div`
  padding: 4px 4px 7px 4px;
`;

const StyledTitle = styled.h3<ColorProps & SpaceProps & TypographyProps & LayoutProps>`
  ${color}
  ${space}
  ${typography}
  ${layout}
  overflow: hidden;
  flex-grow: 1;
`;

StyledTitle.defaultProps = {
  color: 'text',
  fontSize: '19px',
  lineHeight: '27px',
  height: '80px',
  mx: 0,
  my: [0, '8px'],
};

const Tags = styled(Text)``;

Tags.defaultProps = {
  color: '#989898',
  fontSize: '16px',
  lineHeight: '22px',
  fontFamily: 'secondary',
  my: '7px',
};

const Price = styled(Text)``;

Price.defaultProps = {
  color: '#1D3461',
  fontSize: '18px',
  lineHeight: '26px',
  fontWeight: 'bold',
  fontFamily: 'secondary',
  my: '0',
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

interface ListingGridItemProps extends React.HTMLAttributes<HTMLElement>, LayoutProps {
  imageUrl?: string;
  title: string;
  tags?: string[];
  price: string;
  seller?: string;
  photoCount?: number;
  rightTopElement?: React.ReactNode;
  rightBottomElement?: React.ReactNode;
}

export const ListingGridItem: React.FC<ListingGridItemProps> = (props: ListingGridItemProps) => {
  const { imageUrl, title, tags, price, rightBottomElement, photoCount, rightTopElement, ...rest } = props;

  return (
    <Container {...rest}>
      <Image src={imageUrl} alt={title} height="182px" />
      {photoCount !== undefined && (
        <AddOn left="3px" top="3px">
          <PhotoCount>{photoCount}</PhotoCount>
        </AddOn>
      )}
      {rightTopElement !== undefined && (
        <AddOn right="3px" top="3px">
          {rightTopElement}
        </AddOn>
      )}
      <Main>
        <StyledTitle color="text">{title}</StyledTitle>
        <Tags>
          {tags.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              {index < tags.length - 1 && <TagSeparator />}
            </React.Fragment>
          ))}
        </Tags>
        <Flex justifyContent="space-between">
          <Price>{price}</Price>
          {rightBottomElement}
        </Flex>
      </Main>
    </Container>
  );
};

const Seller = styled.div`
  color: #ff3c35;
  font-size: 12px;
  line-height: 17px;
  font-weight: bold;
  margin: 8px 0;
`;

export const ListingGridItemMini: React.FC<ListingGridItemProps> = (props: ListingGridItemProps) => {
  const { imageUrl, seller, title, price, rightBottomElement, photoCount, rightTopElement, ...rest } = props;

  return (
    <Container {...rest}>
      <Image src={imageUrl} alt={title} height="117px" />
      {photoCount !== undefined && (
        <AddOn left="3px" top="3px">
          <PhotoCount>{photoCount}</PhotoCount>
        </AddOn>
      )}
      {rightTopElement !== undefined && (
        <AddOn right="3px" top="3px">
          {rightTopElement}
        </AddOn>
      )}
      <Main>
        <Seller>{seller}</Seller>
        <StyledTitle fontSize="13px" lineHeight="16px" height="48px">
          {title}
        </StyledTitle>
        <Flex justifyContent="space-between" alignItems="center">
          <Price fontSize="15px" lineHeight="26px">
            {price}
          </Price>
          {rightBottomElement}
        </Flex>
      </Main>
    </Container>
  );
};

export default ListingGridItem;
