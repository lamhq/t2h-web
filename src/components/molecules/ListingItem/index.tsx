import * as React from 'react';
import styled from 'styled-components';
import { layout, position, PositionProps, LayoutProps } from 'styled-system';
import Box from '@components/layouts/Box';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';

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

const Description = styled.div`
  padding: 3px;
  flex-grow: 1;
`;

const StyledTitle = styled(Title)`
  overflow-wrap: break-word;
  overflow: hidden;
  height: 30px;
  display: flex;
  justify-content: space-between;
`;

StyledTitle.defaultProps = {
  textAlign: 'left',
  fontSize: '13px',
  lineHeight: '16px',
  my: 0,
};

const Tags = styled(Text)``;

Tags.defaultProps = {
  color: '#989898',
  fontSize: '12px',
  lineHeight: '12px',
  fontFamily: 'secondary',
  my: '7px',
};

const Price = styled(Text)``;

Price.defaultProps = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '16px',
  fontFamily: 'secondary',
  my: '7px',
};

const AddOn = styled.div<PositionProps>`
  ${position};
  position: absolute;
`;

const TagSeparator = () => <>&nbsp;&nbsp;|&nbsp;&nbsp;</>;

interface ListingItemProps extends React.HTMLAttributes<HTMLElement>, LayoutProps {
  imageUrl?: string;
  companyName?: string;
  title: string;
  tags?: string[];
  price: string;
  hasBorder?: boolean;
  leftTopElement?: React.ReactNode;
  rightTopElement?: React.ReactNode;
  rightBottomElement?: React.ReactNode;
}

const ListingItem: React.FC<ListingItemProps> = (props: ListingItemProps) => {
  const { imageUrl, companyName, title, tags, price, rightBottomElement, leftTopElement, rightTopElement, ...rest } = props;

  return (
    <ListingItemWrapper {...rest}>
      <Image src={imageUrl} alt={title} size={props.height} />
      {leftTopElement && (
        <AddOn left="3px" top="3px">
          {leftTopElement}
        </AddOn>
      )}
      <Description>
        {companyName && (
          <Text mt={0} mb="5px" variant="extraSmall" color="red" fontFamily="secondary" fontWeight="bold">
            {companyName}
          </Text>
        )}
        <StyledTitle as="h3">
          {title}
          <Box ml="auto">{rightTopElement}</Box>
        </StyledTitle>
        {tags !== undefined && (
          <Tags>
            {tags.map((item, index) => (
              <span key={index}>
                {item}
                {index < tags.length - 1 && <TagSeparator />}
              </span>
            ))}
          </Tags>
        )}
        <Price>{price}</Price>
      </Description>
      {rightBottomElement && (
        <AddOn right="3px" bottom="3px">
          {rightBottomElement}
        </AddOn>
      )}
    </ListingItemWrapper>
  );
};

ListingItem.defaultProps = {
  height: '80px',
};

export default ListingItem;
