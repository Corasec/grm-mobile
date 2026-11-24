import { compareIdsEquivalence } from './utils';

type StatusLike = { id?: number | string; final_status?: boolean; rejected_status?: boolean } | number | string | null | undefined;

/**
 * A resolved or rejected issue is closed: the committee can no longer add steps, comments or files.
 * The issue status may be a full object or only an id: the flags are then read from `statuses`.
 */
export function isIssueClosed(issueStatus: StatusLike, statuses: StatusLike[] = []): boolean {
  if (!issueStatus) return false;
  if (typeof issueStatus === 'object' && (issueStatus.final_status || issueStatus.rejected_status)) return true;
  const id = typeof issueStatus === 'object' ? issueStatus.id : issueStatus;
  return statuses.some(
    (s) => typeof s === 'object' && !!s && (s.final_status || s.rejected_status) && compareIdsEquivalence(s.id, id)
  );
}
