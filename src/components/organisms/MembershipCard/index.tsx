import React from 'react';
import UpsellCard from '@components/molecules/UpsellCard';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ButtonVariant } from '@components/atoms/Button';

export interface MembershipCardProps extends WithTranslation {
  buttonLink?: string;
  buttonText?: string;
  buttonVariant?: ButtonVariant;
  priceLabel?: string;
}

const MembershipBuyerCardInner: React.FC<MembershipCardProps> = (props: MembershipCardProps) => {
  const { t, buttonText, buttonVariant = 'primary' } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/buyer.svg"
      title={t('Buyer')}
      descriptionItems={[
        t('View all community listings'),
        t('Directly contact sellers & ask product related questions'),
        t('Buy directly from seller without complicated system'),
      ]}
      buttonText={buttonText}
      variant={buttonVariant}
    />
  );
};

export const MembershipBuyerCard = withTranslation('membership')(MembershipBuyerCardInner);

const MembershipSellerCardInner: React.FC<MembershipCardProps> = (props: MembershipCardProps) => {
  const { t, buttonText, buttonLink, buttonVariant = 'primary' } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-basic.svg"
      title={t('Seller')}
      descriptionItems={[
        t('Everything in Buyer'),
        <span key={1}>
          {t('Create exclusive listings on')} <strong>Truck2Hand</strong>
        </span>,
        t('Boost your listings to the top of results'),
      ]}
      buttonLink={buttonLink}
      buttonText={buttonText}
      variant={buttonVariant}
    />
  );
};

export const MembershipSellerCard = withTranslation('membership')(MembershipSellerCardInner);

const MembershipSellerProCardInner: React.FC<MembershipCardProps> = (props: MembershipCardProps) => {
  const { t, priceLabel, buttonText, buttonLink, buttonVariant = 'primary' } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-pro.svg"
      title={t('Pro')}
      subTitle={priceLabel}
      descriptionItems={[t('Everything in Seller basic'), t('10 posts / month'), t('Attach 15 pictures to each post')]}
      buttonLink={buttonLink}
      buttonText={buttonText}
      variant={buttonVariant}
    />
  );
};

export const MembershipSellerProCard = withTranslation('membership')(MembershipSellerProCardInner);

const MembershipSellerSilverCardInner: React.FC<MembershipCardProps> = (props: MembershipCardProps) => {
  const { t, priceLabel, buttonText, buttonLink, buttonVariant = 'primary' } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-silver.svg"
      title={t('Silver')}
      subTitle={priceLabel}
      descriptionItems={[
        t('Everything in Seller pro'),
        t('50 posts / month'),
        t('Attach 25 pictures and videos to each post'),
        t('Dedicated related posts for your shop'),
        t('50 Free coins / month'),
        t('Own shop'),
      ]}
      buttonLink={buttonLink}
      buttonText={buttonText}
      variant={buttonVariant}
    />
  );
};

export const MembershipSellerSilverCard = withTranslation('membership')(MembershipSellerSilverCardInner);

const MembershipSellerGoldCardInner: React.FC<MembershipCardProps> = (props: MembershipCardProps) => {
  const { t, priceLabel, buttonText, buttonLink, buttonVariant = 'primary' } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-gold.svg"
      title={t('Gold')}
      subTitle={priceLabel}
      descriptionItems={[
        t('Everything in Seller Silver'),
        t('Unlimited post'),
        t('Attach 25 pictures and videos to each post'),
        t('Dedicated related posts for your shop'),
        t('200 Free coins / month'),
        t('Own shop'),
      ]}
      buttonLink={buttonLink}
      buttonText={buttonText}
      variant={buttonVariant}
    />
  );
};

export const MembershipSellerGoldCard = withTranslation('membership')(MembershipSellerGoldCardInner);
