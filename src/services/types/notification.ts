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

export interface NotificationResponse {
  isRead: boolean;
  type: NotificationType;
  content: string;
  seenAt?: string;
  hashId: string;
  receiverHashId: string;
  senderHashId: string;
  timestamp: string;
}

export type NotificationArrayResponse = NotificationResponse[];
