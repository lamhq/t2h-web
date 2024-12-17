import React from 'react';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import Dialog from '@components/molecules/Dialog';
import { Button } from '@components/atoms/Button';
import { Text, TextLink } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import Link from 'next/link';
import { REPORT_REASON_OPTIONS } from '@constants/formdata';

export interface ReportListingButtonProps extends WithTranslation {
  listingHashId: string;
}

const ReportListingButton: React.FC<ReportListingButtonProps> = ({
  t,
  listingHashId,
}: React.PropsWithChildren<ReportListingButtonProps>) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);

  const onClose = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  const onActionButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  return (
    <Flex justifyContent="center">
      <TextLink onClick={onButtonClick}>{t(`Report listing`)}</TextLink>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        showsTitle={true}
        showsCloseIcon={false}
        showsActionButton={false}
        title={t('Report listing')}
      >
        <Text>{t('If there is an issue with this listing, please select the appropriate reporting option.')}</Text>
        {REPORT_REASON_OPTIONS.map((item) => {
          const url = `/listing/${listingHashId}/report?reason=${item.value}`;

          return (
            <Link href={url} key={item.value}>
              <Text>
                <TextLink variant="medium">{item.label}</TextLink>
              </Text>
            </Link>
          );
        })}
        <Flex justifyContent="center" mt="27px">
          <Button variant="transparent" onClick={onActionButtonClick}>
            {t('Cancel')}
          </Button>
        </Flex>
      </Dialog>
    </Flex>
  );
};

export default withTranslation('common')(ReportListingButton);
