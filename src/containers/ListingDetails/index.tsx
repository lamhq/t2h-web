import React from 'react';
import { withTranslation } from 'react-i18next';
import { WithTranslation, TFunction } from 'next-i18next';
import { useAuthContext } from '@hocs/withAuth';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import Separator from '@components/atoms/Separator';
import { Button, ButtonLink } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import { SubTitle } from '@components/atoms/Title';
import PreviewImages from '@components/molecules/PreviewImages';
import Price from '@components/atoms/Price';
import ListingDescription from '@components/molecules/ListingDescription';
import PairItem from '@components/atoms/PairItem';
import SellerProfile from '@components/molecules/SellerProfile';
import { PhoneAndroidIcon } from '@components/atoms/IconButton';
import QuestionAndAnswer from '@components/molecules/ListingQuestionAndAnswer';
import Location from '@components/molecules/Location';
import { UserResponse, ItemResponse, CommentArrayResponse } from '@services/types';
import { KEY_PREFER_ANONYMOUS_QUESTION } from '@constants/localstorage';
import NoSsr from '@components/layouts/NoSsr';
import TextArea from '@components/molecules/TextArea';
import CheckBox from '@components/molecules/CheckBox';
import ReportListingButton from '@components/organisms/ReportListingButton';
import { isInteger } from '@common/utils';

interface ContactProps {
  t: TFunction;
  title: string;
  phone: string;
  isPhoneNumberVisible: boolean;
  onViewSellerProfileClick: React.MouseEventHandler;
}

const Contact = ({ t, title, phone, isPhoneNumberVisible, onViewSellerProfileClick }: ContactProps) => (
  <Box>
    <Text my={0} fontSize="19px" lineHeight="23px" fontWeight="bold">
      {title}
    </Text>
    {isPhoneNumberVisible === true && (
      <Flex mt={2} alignItems="center">
        <PhoneAndroidIcon size="18px" color="label" />
        <Text my="13px" ml={3} variant="small" color="darkGrey">
          {phone}
        </Text>
      </Flex>
    )}
    {isPhoneNumberVisible === false && (
      <Box mt={3} display={{ _: 'none', md: 'block' }}>
        <Button variant="contact" onClick={onViewSellerProfileClick}>
          {t(`View seller details`)}
        </Button>
      </Box>
    )}
  </Box>
);

const ItemDetails = ({ t, item }: { t: TFunction; item: ItemResponse }) => {
  const usage = isInteger(item.usage) ? Number(item.usage).toLocaleString() : item.usage;

  return (
    <>
      <SubTitle my={0} mb="3px" textAlign="left" fontSize="19px" lineHeight="23px" color="darkGrey">
        {t(`Details`)}
      </SubTitle>
      {/* currently brand id migration is not yet finished */}
      <PairItem left={t(`Brand`)} right={t(item.brand?.name)} />
      {/* currently model migration is not yet finished */}
      <PairItem left={t(`Model`)} right={t(item.model?.name)} />
      <PairItem left={t(`Prod.year`)} right={item.productionYear.toString()} />
      <PairItem left={t(`Mileage`)} right={usage} />
    </>
  );
};

interface QuestionFormProps {
  t: TFunction;
  onCommentSubmit?: (comment: string, isAnonymous: boolean) => Promise<void>;
}

const QuestionForm = (props: QuestionFormProps) => {
  const { t, onCommentSubmit } = props;
  const me = useAuthContext();

  const isAnonymous = localStorage.getItem(KEY_PREFER_ANONYMOUS_QUESTION) === 'true';

  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      question: '',
      isAnonymous: isAnonymous,
    },
  });

  const onSubmit = React.useCallback(
    async (data: { question: string; isAnonymous: boolean }) => {
      if (onCommentSubmit) {
        await onCommentSubmit(data.question, data.isAnonymous);
        localStorage.setItem(KEY_PREFER_ANONYMOUS_QUESTION, data.isAnonymous.toString());
      }

      reset({
        question: '',
        isAnonymous: data.isAnonymous,
      });
    },
    [onCommentSubmit, reset],
  );

  return (
    <Box>
      <Text my={0} color="darkGrey" fontSize="19px" lineHeight="23px" fontWeight="bold">
        {t(`Ask a question`)}
      </Text>
      <Text my={0} mt={2} color="description" fontFamily="secondary">
        {t(
          `If you don’t see an answer to a question you might have, you can ask using the form below. Your question will be sent to the seller and once answered, your question will be posted for others to see.`,
        )}
      </Text>

      <Box mt={2}>
        {me ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              ref={register({
                required: true,
              })}
              name="question"
              placeholder={t(`Ask the seller a question`)}
            />
            <Box mt="9px">
              <CheckBox
                ref={register}
                name="isAnonymous"
                label={t(`Make my question anonymous`)}
                defaultChecked={isAnonymous}
                defaultValue={isAnonymous}
              />
            </Box>
            <Flex mt={3}>
              <Box ml="auto" width="125px">
                <Button>{t(`Ask question`)}</Button>
              </Box>
            </Flex>
          </form>
        ) : (
          <Box width="200px" mt={2} mx="auto">
            <ButtonLink href={`/signin`}>{t(`Sign in to ask questions`)}</ButtonLink>
          </Box>
        )}
      </Box>
    </Box>
  );
};

interface QuestionAndAnswersProps {
  t: TFunction;
  comments?: CommentArrayResponse;
  onCommentSubmit?: (comment: string, isAnonymous: boolean) => Promise<void>;
}

const QuestionAndAnswers = (props: QuestionAndAnswersProps) => {
  const { t, comments = [], onCommentSubmit } = props;

  const now = moment();

  return (
    <Box>
      <Text my={0} color="darkGrey" fontSize="19px" lineHeight="23px" fontWeight="bold">
        {t(`Questions & answers`)}
      </Text>
      <Box mt={3}>
        {comments.map((comment, index) => {
          const isProfileVisible = comment.visibility === true;
          const iconUrl = isProfileVisible ? comment.sender?.profileImageUrl : null;
          const senderName = isProfileVisible ? comment.sender?.displayName : null;
          const senderProfileUrl = isProfileVisible ? `/u/${comment.sender?.hashId}` : null;
          const date = moment(comment.timestamp).from(now);

          const reportLink = `/comment/report?hashId=${comment.hashId}`;

          return (
            <React.Fragment key={index}>
              {/* todo: create page for report comment */}
              <QuestionAndAnswer
                questionerIconUrl={iconUrl}
                questionerName={senderName}
                questionDate={date}
                question={comment.message}
                linkForReport={reportLink}
                linkForQuestioner={senderProfileUrl}
              />
              <Separator height="32px" color="#cacaca" />
            </React.Fragment>
          );
        })}
      </Box>
      <NoSsr>
        <QuestionForm t={t} onCommentSubmit={onCommentSubmit} />
      </NoSsr>
    </Box>
  );
};

interface ListingDetailsProps extends WithTranslation {
  item: ItemResponse;
  seller: UserResponse;
  shopImageSrcs: string[];

  isContactSellerVisible: boolean;
  isPhoneNumberVisible?: boolean;
  onViewSellerProfileClick?: React.MouseEventHandler;

  isCommentsBoxVisible?: boolean;
  comments?: CommentArrayResponse;
  onCommentSubmit?: (message: string, isAnonymous: boolean) => Promise<void>;
}

const ListingDetails = (props: ListingDetailsProps) => {
  const {
    t,
    item,
    seller,
    shopImageSrcs,
    isContactSellerVisible,
    isPhoneNumberVisible,
    onViewSellerProfileClick,
    isCommentsBoxVisible,
    comments,
    onCommentSubmit,
  } = props;

  const imageSources = React.useMemo(() => item.images.map((img) => img.url), [item]);
  const sellingPriceAmount = item.sellingPrice ? Number.parseInt(`${item.sellingPrice}`).toLocaleString() : '';
  const sellingPrice = `${sellingPriceAmount} THB`;
  const isVerified = seller.isEmailVerified || seller.isMobileVerified;

  //todo: fill these parameters
  const numOfSellerListing = 0;
  const sellerLineLink = ``;
  const sellerFacebookLink = ``;
  const sellerPhone = seller.contactNumber || t('No contact mobile number');

  return (
    <Flex width="100%" justifyContent="center">
      <Box width={{ _: 1, md: '960px' }} pt={{ _: 0, md: 3 }} pb={{ _: 3, md: 5 }}>
        <Flex justifyContent="space-between">
          <Box width={{ _: 1, md: 'calc((100% - 16px) * 2 / 3)' }}>
            <PreviewImages srcs={imageSources} />

            <Box mx={{ _: 2, md: 0 }} mt={{ _: 3, md: 0 }}>
              <Box display={{ _: 'block', md: 'none' }}>
                <Price title={t(`Asking Price`)} price={sellingPrice} />
                <Box mt={3}>
                  <Location location={item.pickupLocation} />
                </Box>
              </Box>
              <Box mt={{ _: 3, md: 5 }}>
                <ListingDescription title={item.title} description={item.detail} />
              </Box>
              <Box mt={5}>
                <ItemDetails t={t} item={item} />
              </Box>
              <Box mt={5} display={{ _: 'block', md: 'none' }}>
                <SellerProfile
                  iconSrc={seller.profileImageUrl}
                  isVerified={isVerified}
                  name={seller.displayName}
                  numOfListing={numOfSellerListing}
                  description={seller.description}
                  linkForViewMore={`/u/${seller.hashId}`}
                  imagesSrc={shopImageSrcs}
                  linkForLineButton={sellerLineLink}
                  linkForFacebookButton={sellerFacebookLink}
                />
              </Box>
              <Box mt={3} display={{ _: 'block', md: 'none' }} height="76px">
                <Contact
                  t={t}
                  title={t(`Contact seller`)}
                  phone={sellerPhone}
                  isPhoneNumberVisible={isPhoneNumberVisible}
                  onViewSellerProfileClick={onViewSellerProfileClick}
                />
              </Box>
              {isCommentsBoxVisible === true && (
                <Box mt={5}>
                  <QuestionAndAnswers t={t} comments={comments} onCommentSubmit={onCommentSubmit} />
                </Box>
              )}

              <Box mt={5} display={{ _: 'block', md: 'none' }}>
                <ReportListingButton listingHashId={item.hashId} />
              </Box>
            </Box>
          </Box>

          <Box display={{ _: 'none', md: 'block' }} width={{ _: '100%', md: 'calc((100% - 16px) / 3)' }}>
            <Box>
              <Price title={t(`Asking Price`)} price={sellingPrice} />
              <Box mt={3}>
                <Location location={item.pickupLocation} />
              </Box>
            </Box>
            <Box mt={5} border="1px solid #DDDDDD" borderRadius="6px">
              <Box p={3}>
                <SellerProfile
                  iconSrc={seller.profileImageUrl}
                  isVerified={isVerified}
                  name={seller.displayName}
                  numOfListing={numOfSellerListing}
                  description={seller.description}
                  linkForViewMore={`/u/${seller.hashId}`}
                  imagesSrc={shopImageSrcs}
                  linkForLineButton={sellerLineLink}
                  linkForFacebookButton={sellerFacebookLink}
                />
              </Box>
              {isContactSellerVisible === true && (
                <>
                  <Separator borderBottomColor="#DDDDDD" />
                  <Box p={3}>
                    <Contact
                      t={t}
                      title={t(`Contact seller`)}
                      phone={sellerPhone}
                      isPhoneNumberVisible={isPhoneNumberVisible}
                      onViewSellerProfileClick={onViewSellerProfileClick}
                    />
                  </Box>
                </>
              )}
            </Box>
            <Flex mt={3} justifyContent="center">
              <ReportListingButton listingHashId={item.hashId} />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

ListingDetails.defaultProps = {
  isContactSellerVisible: true,
  isPhoneNumberVisible: false,
  isCommentsBoxVisible: true,
};

export default withTranslation('common')(ListingDetails);
