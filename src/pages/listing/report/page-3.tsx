import React from 'react';
import Head from 'next/head';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import ListingItem from '@components/molecules/ListingItem';
import { Button } from '@components/atoms/Button';
import { OuterTitle, SubTitle } from '@components/atoms/Title';
import { MoreVertIcon, GreenCheckIcon } from '@components/atoms/IconButton';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import InputText from '@components/molecules/InputText';
import TextArea from '@components/molecules/TextArea';
import InputImages from '@components/molecules/InputImages';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import ListingItemBig from '@components/molecules/ListingItemBig';

const Page3: React.FC<WithTranslation> = ({ t }: WithTranslation) => {
  return (
    <Layout>
      <Head>
        <title>{t('Report listing')}</title>
      </Head>
      <OuterTitle fontSize="23px" color="#333" textAlign="left">
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={0} mb={0}>
          <Box width={{ _: 1, md: '968px' }}>{t('Report listing')}</Box>
        </Flex>
      </OuterTitle>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={0} mb={0}>
          <Box width={{ _: 1, md: '500px' }}>
            <Box mt={0} mb={'32px'}>
              <Box display={{ _: 'block', md: 'none' }}>
                <ListingItem
                  imageUrl="/static/images/3.jpg"
                  title="ขายรถเครน TADANO TR250M-6 (ขนาด 25 ตัน) ปี 1999 นำเข้าเองจากญี่ปุ่น สภาพสวยพร้อมใช้ มีVDOการทำงานครับ"
                  tags={['2017', 'Manual', '8.5L']}
                  price="470,000 THB"
                  hasBorder
                  leftTopElement={<GreenCheckIcon />}
                  rightTopElement={<MoreVertIcon size="18px" />}
                />
              </Box>
              <Box display={{ _: 'none', md: 'block' }}>
                <ListingItemBig
                  imageUrl="/static/images/1.jpg"
                  title="DAF FA LF55.220 Sleeper 28 Foot 2ins Curtain c/w Taillift"
                  tags={['2017', 'Manual', '8.5L']}
                  price="470,000 THB"
                />
              </Box>
            </Box>
            <SubTitle fontSize={3} textAlign="left" mb={3}>
              {t('Report details')}
            </SubTitle>
            <FormGroup>
              <FormControl>
                <InputText type="text" label={t('Report type')} value="Fraudulent listing" isPlainText />
              </FormControl>
            </FormGroup>

            <FormGroup>
              <FormControl>
                <TextArea label={t('Details')} placeholder={t('Provide additional information')}></TextArea>
              </FormControl>
            </FormGroup>

            <SubTitle fontSize={3} textAlign="left" mt={4}>
              {t('Attachments')}
            </SubTitle>
            <FormGroup>
              <FormControl>
                {/* TODO: to be replaced with InputImageController */}
                <InputImages onImageRemove={() => true} onImagesAdd={() => true} images={[]} maximumNumber={2} />
              </FormControl>
            </FormGroup>

            <FormGroup>
              <FormControl>
                <Box display={{ _: 'none', md: 'block' }}>
                  <Flex justifyContent="flex-end">
                    <Button block={false}>{t('Report listing')}</Button>
                  </Flex>
                </Box>
                <Box display={{ _: 'block', md: 'none' }}>
                  <Button>{t('Report listing')}</Button>
                </Box>
              </FormControl>
            </FormGroup>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

export default compose([withTranslation('common')], Page3);
