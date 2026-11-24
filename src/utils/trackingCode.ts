/**
 * Tracking code given to the complainant, generated offline on the phone.
 *
 * Format: <word><reporter account id>-<counter>, e.g. "lac17-4" = 4th issue registered by the
 * account 17. The account id makes codes unique across phones, the counter unique per account.
 * The counter is stored on the phone and also re-computed from the issues already known locally,
 * so that reinstalling the app does not restart it at 1. The server refuses duplicates as a
 * safety net.
 */

export const TRACKING_WORDS = ['lac', 'plaine', 'savane', 'colline'];

const CODE_PATTERN = /^[a-z]+(\d+)-(\d+)$/i;

export function buildTrackingCode(word: string, userId: number | string, sequence: number): string {
  return `${word}${userId}-${sequence}`;
}

/** Highest counter already used by ``userId`` among ``codes``. */
export function maxSequenceForUser(codes: Array<string | null | undefined>, userId: number | string): number {
  return codes.reduce((max, code) => {
    const match = CODE_PATTERN.exec(String(code ?? ''));
    if (!match || match[1] !== String(userId)) return max;
    return Math.max(max, Number(match[2]));
  }, 0);
}

export function counterStorageKey(userId: number | string): string {
  return `TRACKING_CODE_COUNTER_${userId}`;
}

/**
 * Next tracking code for ``userId``: counter = 1 + the highest of the stored counter and the
 * counters found in ``existingCodes``. The new counter is saved through ``storage``.
 */
export async function nextTrackingCode(
  userId: number | string,
  existingCodes: Array<string | null | undefined>,
  storage: { get: (key: string) => Promise<any>; set: (key: string, value: any) => Promise<void> },
  random: () => number = Math.random
): Promise<string> {
  const key = counterStorageKey(userId);
  const stored = Number(await storage.get(key)) || 0;
  const sequence = Math.max(stored, maxSequenceForUser(existingCodes, userId)) + 1;
  await storage.set(key, sequence);
  const word = TRACKING_WORDS[Math.floor(random() * TRACKING_WORDS.length)] ?? TRACKING_WORDS[0];
  return buildTrackingCode(word, userId, sequence);
}
