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
    return t('account_type_facilitator');
  }
  return '';
}
