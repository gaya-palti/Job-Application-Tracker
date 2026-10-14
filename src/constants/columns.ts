import { Column } from '../types';

// Column ids double as job statuses, so a few are referenced elsewhere (card icons, analytics,
// notifications). 'Offers' keeps its old id so existing offer logic keeps working.
export const DEFAULT_COLUMNS: Column[] = [
  { id: 'Referral Requested', title: 'Referral Requested' },
  { id: 'Applied', title: 'Applied' },
  { id: 'Screening Call', title: 'Screening Call' },
  { id: 'Home Assignment', title: 'Home Assignment' },
  { id: 'Technical Interview', title: 'Technical Interview' },
  { id: 'HR Interview', title: 'HR Interview' },
  { id: 'Offers', title: 'Offer' },
];

export const INTERVIEW_STATUSES = ['Screening Call', 'Home Assignment', 'Technical Interview', 'HR Interview'];

// Stages from the original board that no longer exist, and where their jobs move to.
export const LEGACY_STATUS_MAP: Record<string, string> = {
  'Bookmarked': 'Referral Requested',
  'Technical Assessment': 'Home Assignment',
  'Onsite': 'Technical Interview',
};

export function hasLegacyColumns(columns: Column[]) {
  return columns.some(col => col.id in LEGACY_STATUS_MAP);
}

// New default stages, followed by any custom columns the user added (e.g. Rejected).
export function migrateColumns(columns: Column[]): Column[] {
  const defaultIds = new Set(DEFAULT_COLUMNS.map(col => col.id));
  const custom = columns.filter(col => !(col.id in LEGACY_STATUS_MAP) && !defaultIds.has(col.id));
  return [...DEFAULT_COLUMNS, ...custom];
}
