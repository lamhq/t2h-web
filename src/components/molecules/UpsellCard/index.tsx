import * as React from 'react';
import styled, { css } from 'styled-components';
import { SpaceProps } from 'styled-system';
import Link from 'next/link';
import CardAtom from '@components/atoms/Card';
import { Text as TextAtom } from '@components/atoms/Text';
import { Title as TitleAtom } from '@components/atoms/Title';
import { Button as ButtonAtom, ButtonVariant } from '@components/atoms/Button';
import { CheckCircleIcon } from '@components/atoms/IconButton';

interface UpsellCardProps extends SpaceProps {
  title: string;
  imageUrl: string;
  subTitle?: string;
  descriptionItems?: React.ReactNode[];
  buttonLink?: string;
  buttonText?: string;
  variant?: ButtonVariant;
}

const Card = styled(CardAtom)<SpaceProps>`
  overflow: hidden;
`;

const Title = styled(TitleAtom)`
  margin: 0;
  color: ${({ theme }) => theme.colors.label};
  font-size: ${({ theme }) => theme.fontSizes[5]};
  letter-spacing: ${({ theme }) => theme.letterSpacings[5]};
  line-height: ${({ theme }) => theme.lineHeights[5]};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const SubTitle = styled(TextAtom)`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.label};
  font-size: ${({ theme }) => theme.fontSizes[3]};
  font-family: ${({ theme }) => theme.fonts.secondary};
`;

const Image = styled.img`
  margin: 42px auto 22px auto;
  display: block;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
`;

const DescriptionItem = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const DescriptionText = styled(TextAtom)`
  letter-spacing: 0.09px;
  margin: 0 0 0 9px;
  font-size: ${({ theme }) => theme.fontSizes[1]};
  color: ${({ theme }) => theme.colors.label};
`;

const ButtonCommonStyles = css`
  height: 48px;
  border: none;
  border-radius: 0 0 8px 8px;
  font-weight: bold;
  line-height: 48px !important;
  ${({ theme }) =>
    css`
      font-size: ${theme.fontSizes[3]};
      letter-spacing: ${theme.letterSpacings[2]};
      line-height: ${theme.lineHeights[2]};
      font-family: ${theme.fonts.primary};
    `}
`;

const ButtonLink = styled(ButtonAtom.withComponent('a'))`
  ${ButtonCommonStyles}
`;

const ButtonDiv = styled(ButtonAtom.withComponent('div'))`
  ${ButtonCommonStyles}
  cursor: default;
`;

const UpsellCard: React.FC<UpsellCardProps> = (props: UpsellCardProps) => {
  const { imageUrl, title, subTitle, buttonLink, buttonText, variant = 'primary', descriptionItems, ...rest } = props;

  return (
    <Card {...rest}>
      <Image src={imageUrl} alt="" />
      <Title as="h3">{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
      <Description>
        {descriptionItems.map((text, i) => (
          <DescriptionItem key={i}>
            <CheckCircleIcon size="18px" mt="2px" />
            <DescriptionText>{text}</DescriptionText>
          </DescriptionItem>
        ))}
      </Description>
      {(() => {
        if (buttonText && buttonLink) {
          return (
            <Link href={buttonLink}>
              <ButtonLink variant={variant}>{buttonText}</ButtonLink>
            </Link>
          );
        } else if (buttonText) {
          return <ButtonDiv variant={variant}>{buttonText}</ButtonDiv>;
        }
      })()}
    </Card>
  );
};

export default UpsellCard;
