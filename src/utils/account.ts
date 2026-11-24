/**
 * Mobile account rules.
 *
 * Two kinds of accounts use the app (see GET /authentication/profile/):
 *  - committee: the secretary's account of a CCGP (village), CLGP (commune) or the national
 *    committee. Receives and processes issues (accept, reject, steps, resolution, escalation).
 *  - facilitator: field staff. Creates and follows issues, never processes them.
 */

export const ACCOUNT_TYPES = {
  COMMITTEE: 'committee',
  FACILITATOR: 'facilitator',
} as const;

export const LOCATION_MODES = {
  FIXED: 'fixed', // single region, preselected and locked (e.g. CCGP village)
  LIST: 'list', // pick one of the regions sent by the server
  FREE: 'free', // any region (e.g. national committee)
} as const;

export type IssueTab = 'reported' | 'assigned' | 'resolved';

export type Region = {
  id: number | string;
  name: string;
  hierarchical_name?: string;
  [key: string]: any;
};

export type MobileProfile = {
  account_type?: string;
  can_process_issues?: boolean;
  committee?: { department?: { id: number; name: string }; administrative_level?: { id: number; name: string } } | null;
  administrative_region?: Region | null;
  location?: { mode?: string; regions?: Region[] } | null;
  [key: string]: any;
} | null | undefined;

/** A profile is usable only if it comes from the current API (it carries an account type). */
export function hasMobileAccountType(profile: MobileProfile): boolean {
  return profile?.account_type === ACCOUNT_TYPES.COMMITTEE || profile?.account_type === ACCOUNT_TYPES.FACILITATOR;
}

export function isCommittee(profile: MobileProfile): boolean {
  return profile?.account_type === ACCOUNT_TYPES.COMMITTEE;
}

export function isFacilitator(profile: MobileProfile): boolean {
  return profile?.account_type === ACCOUNT_TYPES.FACILITATOR;
}

/** Only committee accounts process issues; anything unknown is treated as read-only. */
export function canProcessIssues(profile: MobileProfile): boolean {
  return isCommittee(profile) && profile?.can_process_issues !== false;
}

/** Issue list tabs: facilitators only see the issues they reported. */
export function getIssueTabs(profile: MobileProfile): IssueTab[] {
  return isFacilitator(profile) ? ['reported'] : ['reported', 'assigned', 'resolved'];
}

/**
 * Locations offered by the "location" step of a new issue.
 * - fixed: `fixedRegion` is used, no picker;
 * - list: pick one of the server-provided regions;
 * - free: pick any region of the local administrative regions (`allRegions`).
 */
export function getLocationChoices(
  profile: MobileProfile,
  allRegions: Region[] = []
): { mode: string; fixedRegion: Region | null; items: Region[] } {
  const mode = profile?.location?.mode;
  const regions = profile?.location?.regions ?? [];

  if (mode === LOCATION_MODES.FIXED && regions.length > 0) {
    return { mode, fixedRegion: regions[0], items: [] };
  }
  if (mode === LOCATION_MODES.LIST && regions.length > 0) {
    return {
      mode,
      fixedRegion: null,
      items: regions.map((region) => ({ ...region, hierarchical_name: region.hierarchical_name || region.name })),
    };
  }
  return { mode: LOCATION_MODES.FREE, fixedRegion: null, items: allRegions };
}

/** Short role description, e.g. "Comité — CCGP (village)" or "Facilitateur". */
export function getAccountLabel(profile: MobileProfile, t: (key: string) => string): string {
  if (isCommittee(profile)) {
    const department = profile?.committee?.department?.name;
    const level = profile?.committee?.administrative_level?.name;
    const details = [department, level ? `(${level})` : null].filter(Boolean).join(' ');
    return details ? `${t('account_type_committee')} — ${details}` : t('account_type_committee');
  }
  if (isFacilitator(profile)) {
    if (profile?.field_role === 'FC') return t('field_role_fc');
    if (profile?.field_role === 'SC') return t('field_role_sc');
    return t('account_type_facilitator');
  }
  return '';
}

/** Full location of the account, e.g. "Bénin > Alibori > Banikoara" (falls back to the name). */
export function getLocationLabel(profile: MobileProfile): string {
  const region = profile?.administrative_region;
  return region?.hierarchical_name || region?.name || '';
}

/** Villages covered by a field staff account (empty for committees). */
export function getCoveredVillages(profile: MobileProfile): Region[] {
  if (!isFacilitator(profile)) return [];
  return profile?.location?.regions ?? [];
}

type IssueLike = {
  reporter?: { id?: number | string } | number | string | null;
  status?: { id?: number | string } | number | string | null;
};
type StatusLike = { id?: number | string; final_status?: boolean; rejected_status?: boolean };

/**
 * Counters of a reporter account (field staff): issues it reported, still in progress, closed
 * (resolved or rejected).
 */
export function getReporterCounters(issues: IssueLike[], userId: number | string | undefined, statuses: StatusLike[] = []) {
  const same = (a: any, b: any) => a !== undefined && a !== null && String(a) === String(b);
  const closedIds = statuses.filter((s) => s.final_status || s.rejected_status).map((s) => s.id);
  const reported = issues.filter((i) => {
    const reporter = typeof i.reporter === 'object' && i.reporter !== null ? i.reporter.id : i.reporter;
    return same(reporter, userId);
  });
  const isClosed = (i: IssueLike) => {
    const statusId = typeof i.status === 'object' && i.status !== null ? i.status.id : i.status;
    return closedIds.some((id) => same(id, statusId));
  };
  const closed = reported.filter(isClosed).length;
  return { reported: reported.length, inProgress: reported.length - closed, closed };
}
