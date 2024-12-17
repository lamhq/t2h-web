import * as React from 'react';
import styled from 'styled-components';
import { layout, LayoutProps, SpaceProps } from 'styled-system';
import Box from '@components/layouts/Box';

const Container = styled(Box)`
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 17px 2px rgba(0, 0, 0, 0.14);
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Img = styled.img<LayoutProps>`
  object-fit: cover;
  ${layout}
`;

const ContentWrapper = styled.article`
  padding: 6px 16px;
  font-family: ${({ theme }) => theme.fonts.secondary};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes[3]};
  font-weight: normal;
  line-height: ${({ theme }) => theme.lineHeights[3]};
  letter-spacing: 0.09px;
  margin: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  margin: 0;
`;

interface ArticleProps extends SpaceProps {
  photoUrl: string;
  title: string;
  description: string;
  className?: string;
  width?: LayoutProps['width'];
  height?: LayoutProps['height'];
  imageHeight?: LayoutProps['height'];
}

const Article = (props: ArticleProps) => {
  const { photoUrl, title, description, className, width, height, imageHeight } = props;

  return (
    <Container className={className} width={width} height={height}>
      <Img src={photoUrl} width={width as any} height={imageHeight as any} />
      <ContentWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </ContentWrapper>
    </Container>
  );
};

Article.defaultProps = {
  width: { _: '240px', md: '330px' },
  height: { _: '272px', md: '500px' },
  imageHeight: { _: '159px', md: '330px' },
};

export default Article;
