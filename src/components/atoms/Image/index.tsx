import * as React from 'react';
import styled from 'styled-components';
import { layout, LayoutProps, ResponsiveValue } from 'styled-system';

interface ImageProps extends React.HTMLAttributes<HTMLImageElement>, LayoutProps {
  onClick?: React.MouseEventHandler;
  shape?: string;
  objectFit?: string;
  objectPosition?: string;
  borderRadius?: string;
  src: string;
  alt?: string;
  width?: ResponsiveValue<any>;
  height?: ResponsiveValue<any>;
}

const Image = styled.img<ImageProps>`
  ${layout}
  object-fit: ${({ objectFit }) => objectFit ?? 'contain'};
  object-position: ${({ objectPosition }) => objectPosition ?? ''};
  border-radius: ${({ borderRadius, shape }) => borderRadius ?? (shape === 'circle' ? '50%' : '0')};
`;

Image.defaultProps = {
  width: '100%',
  height: '100%',
};

export default Image;
