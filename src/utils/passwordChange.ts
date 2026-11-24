import { passwordRegex } from './formUtils';

export type PasswordChangeForm = { current: string; next: string; confirm: string };

/**
 * Check the password change form before calling the server.
 * Returns the i18n key of the first problem, or null when the form can be sent.
 * Rule shared with the server: at least 8 characters with letters and digits.
 */
export function validatePasswordChange({ current, next, confirm }: PasswordChangeForm): string | null {
  if (!current || !next || !confirm) return 'password_change_fill_all';
  if (!passwordRegex.test(next)) return 'password_change_rule';
  if (next !== confirm) return 'password_change_mismatch';
  if (next === current) return 'password_change_same';
  return null;
}
