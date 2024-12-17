/* eslint-disable no-restricted-imports */
import React from 'react';
import styled from 'styled-components';
import { grid, GridProps } from 'styled-system';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import Link from 'next/link';

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes[1]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  text-align: center;
`;

const Image = styled.img`
  width: 94px;
  height: 65px;
  object-fit: contain;
  margin-bottom: 8px;
`;

const Container = styled.div<GridProps>`
  display: grid;
  ${grid}
`;

const CategoryContainer = styled(Flex)`
  cursor: pointer;
`;

export interface Category {
  name: string;
  image: string;
  url: string;
}

interface CategoryGridProps extends GridProps {
  categories?: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = (props: React.PropsWithChildren<CategoryGridProps>) => {
  const { categories, ...rest } = props;

  return (
    <Container {...rest}>
      {categories.map((cat) => (
        <Box key={cat.name}>
          <Link href={cat.url}>
            <CategoryContainer flexDirection="column" alignItems="center">
              <Image src={cat.image} alt={cat.name} />
              <Title>{cat.name}</Title>
            </CategoryContainer>
          </Link>
        </Box>
      ))}
    </Container>
  );
};

CategoryGrid.defaultProps = {
  categories: [],
  gridColumnGap: { _: '14px', md: '17px' },
  gridRowGap: { _: '22px', md: '40px' },
  gridTemplateColumns: { _: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
};

export default CategoryGrid;
