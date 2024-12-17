import * as React from 'react';
import styled from 'styled-components';
import { flexbox, space, LayoutProps, FlexboxProps, SpaceProps } from 'styled-system';
import Card from '@components/atoms/Card';
import { TextLabel, TextVariant } from '@components/atoms/Text';
import { theme } from '@components/global/theme';

interface FlexCardProps extends LayoutProps, FlexboxProps, SpaceProps {
  height?: any;
  width?: any;
}

const FlexCard = styled(Card)<FlexCardProps>`
  ${space}
  ${flexbox}
  display: flex;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

interface LabelProps extends FlexCardProps {
  label: string;
  fontSizeVariant?: TextVariant;
  fontColor?: string;
  backgroundColor?: string;
}

const Label: React.FC<LabelProps> = (props: LabelProps) => {
  const { label, fontSizeVariant, fontColor, ...rest } = props;

  return (
    <FlexCard {...rest}>
      <TextLabel variant={fontSizeVariant} color={fontColor}>
        {label}
      </TextLabel>
    </FlexCard>
  );
};

Label.defaultProps = {
  height: '34px',
  width: 'auto',
  fontSizeVariant: 'mediumLarge',
  fontColor: theme.colors.white,
  backgroundColor: theme.colors.label,
  alignItems: 'center',
  justifyContent: 'center',
};

Label.displayName = 'Label';

export default Label;
