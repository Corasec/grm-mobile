/**
 * Session rejected by the server (account deactivated in the dashboard, token deleted):
 * every API call answering 401 with a token notifies the listeners (the private router shows
 * a blocking screen). Nothing is deleted: unsent data stays on the phone.
 *
 * Local data owner: unsent data belongs to the account that created it. Another account cannot
 * log in on the phone while such data is waiting (it would be sent under the wrong name).
 */

type Listener = () => void;
const listeners = new Set<Listener>();

export function onSessionRejected(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifySessionRejected(): void {
  listeners.forEach((listener) => listener());
}

/** A 401 on a call sent with a token (not the login call itself, which answers 401 on a wrong password). */
export function isSessionRejected(status?: number, config?: { url?: string; headers?: any }): boolean {
  if (status !== 401 || !config) return false;
  if ((config.url ?? '').includes('authentication/login')) return false;
  const headers = config.headers ?? {};
  return Boolean(headers.Authorization ?? headers.authorization ?? headers.common?.Authorization);
}

export const LOCAL_DATA_OWNER_KEY = 'local_data_owner';

export function normalizeAccount(username?: string | null): string {
  return (username ?? '').trim().toLowerCase();
}

/** Whether ``username`` may log in, given the owner of the local data and whether some of it is unsent. */
export function canLogInOnThisPhone(owner: string | null, username: string, hasUnsentData: boolean): boolean {
  if (!owner || !hasUnsentData) return true;
  return normalizeAccount(owner) === normalizeAccount(username);
}
