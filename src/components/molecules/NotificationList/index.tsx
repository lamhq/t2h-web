import * as React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { WithTranslation, TFunction } from 'next-i18next';
import NotificationItem, { NotificationVariant } from '@components/molecules/NotificationItem';
import { TextLink } from '@components/atoms/Text';
import Box from '@components/layouts/Box';

export enum NotificationType {
  ItemPriceChange = 'item_price_change',
  MembershipApplication = 'membership_application',
  ApproveMembershipApplication = 'approve_membership_application',
  RejectMembershipApplication = 'reject_membership_application',
  SubmitSellerApplication = 'submit_seller_application',
  ApproveSellerApplication = 'approve_seller_application',
  RejectSellerApplication = 'reject_seller_application',
  Other = 'other',
}

export interface Notification {
  isRead: boolean;
  type: NotificationType;
  content: string;
  seenAt?: string;
  hashId: string;
  receiverHashId: string;
  senderHashId: string;
  timestamp: string;
}

const formatDate = (date: string, baseTime: moment.Moment) => {
  const today = baseTime.startOf('day').unix();
  const yesterday = baseTime.subtract(1, 'day').unix();

  const dateObject = moment(date);
  const dateUnix = dateObject.startOf('day').unix();

  if (dateUnix === today) {
    return 'Today';
  } else if (dateUnix === yesterday) {
    return 'Yesterday';
  } else {
    return dateObject.format('MM/DD');
  }
};

const getNotificationVariant = (notification: Notification): NotificationVariant | null => {
  switch (notification.type) {
    //todo: never
    case NotificationType.MembershipApplication:
      return null;
    case NotificationType.ItemPriceChange:
      return 'warning';
    case NotificationType.ApproveMembershipApplication:
      return 'success';
    case NotificationType.RejectMembershipApplication:
      return 'danger';
    case NotificationType.SubmitSellerApplication:
      return null;
    case NotificationType.ApproveSellerApplication:
      return 'success';
    case NotificationType.RejectSellerApplication:
      return 'danger';
    case NotificationType.Other:
      return null;
    default:
      return null;
  }
};

interface NotificationLinkProps {
  t: TFunction;
  notification: Notification;
}

const NotificationLink: React.FC<NotificationLinkProps> = ({ t, notification }: NotificationLinkProps) => {
  switch (notification.type) {
    case NotificationType.ItemPriceChange:
      return null;
    case NotificationType.MembershipApplication:
      return null;
    case NotificationType.ApproveMembershipApplication:
      return <TextLink href="/myaccount/membership">{t(`Go to Memberships`)}</TextLink>;
    case NotificationType.RejectMembershipApplication:
      return <TextLink href="/myaccount/membership">{t(`Go to Memberships`)}</TextLink>;
    case NotificationType.SubmitSellerApplication:
      return null;
    case NotificationType.ApproveSellerApplication:
      return <TextLink href="/myaccount/membership">{t(`Go to Memberships`)}</TextLink>;
    case NotificationType.RejectSellerApplication:
      return <TextLink href="/seller/register">{t(`Go to Seller Applications`)}</TextLink>;
    case NotificationType.Other:
      return null;
    default:
      const invalidType: never = notification.type;

      console.error(`Invalid notification type: ${invalidType}`);
  }
};

const Date = styled.div`
  color: #989898;
  font-size: 10px;
  margin-bottom: 16px;
  line-height: 20px;
  font-weight: bold;
`;

interface NotificationListProps extends WithTranslation {
  notifications: Notification[];
}

const NotificationList = (props: NotificationListProps) => {
  const { t, notifications = [] } = props;

  const notificationsByDate = React.useMemo(() => {
    const notificationsByDate: { date: string; notifications: Notification[] }[] = [];

    for (const notification of notifications) {
      const date = moment(notification.timestamp).format('DD-MM-YYYY');

      const lastDate = notificationsByDate[notificationsByDate.length - 1]?.date;

      if (lastDate === date) {
        notificationsByDate[notificationsByDate.length - 1].notifications.push(notification);
      } else {
        notificationsByDate.push({
          date: date,
          notifications: [notification],
        });
      }
    }

    return notificationsByDate;
  }, [notifications]);

  return (
    <Box>
      {notificationsByDate.map(({ date, notifications }, index) => {
        const now = moment();

        return (
          <React.Fragment key={index}>
            <Date>{t(formatDate(date, now))}</Date>
            {notifications.map((notification, index) => {
              const time = moment(notification.timestamp).format('HH:mm');
              const variant = getNotificationVariant(notification);

              return (
                <NotificationItem key={index} title={notification.content} time={time} variant={variant}>
                  <NotificationLink t={t} notification={notification} />
                </NotificationItem>
              );
            })}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default withTranslation('common')(NotificationList);
