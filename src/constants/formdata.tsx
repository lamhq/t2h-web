import { ReportReason } from '@services/types';

export const PROFILE_OWN_TRUCK_OPTIONS = [
  { value: 'a', label: 'Model A' },
  { value: 'a', label: 'Model B' },
  { value: 'a', label: 'Model C' },
];

export const PROFILE_USE_FREQUENCY_OPTIONS = [
  { value: 'everyday', label: 'Everyday' },
  { value: 'once_a_week', label: 'Once a week' },
  { value: 'few_times_per_month', label: 'A few times per month' },
];

export const PROFILE_SOURCE_OPTIONS = [
  { value: 'a', label: 'Source A' },
  { value: 'a', label: 'Source B' },
  { value: 'a', label: 'Source C' },
];

export const ID_CARD_OPTIONS = [
  { value: 'nationalId', label: 'National Thailand ID' },
  { value: 'passport', label: 'Passport' },
];

export const DEDUCTING_WITHHOLDING_TAX_OPTIONS = [
  { value: 'deduct_tax', label: 'Deduct Tax' },
  { value: 'not_deduct_tax', label: 'Not Deduct Tax' },
];

export const REPORT_REASON_OPTIONS = [
  { label: 'Content related issue', value: ReportReason.Content },
  { label: 'Fraudulent listing', value: ReportReason.Fraud },
  { label: 'Copyright claim', value: ReportReason.Copyright },
  { label: 'Other, not listed', value: ReportReason.Other },
];
