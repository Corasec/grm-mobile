import { COUNTRY_CALLING_CODE } from './constants';

/**
 * International format (`+<country code><number>`) of a phone number, same rules as the server
 * (grm.utils.normalize_phone_number): `+229 01 97 00 00 00`, `00229 0197000000`, `2290197000000`
 * and the national format `01 97 00 00 00` all give `+2290197000000`. Returns '' without digits.
 */
export function normalizePhoneNumber(phoneNumber?: string | null, countryCallingCode: string = COUNTRY_CALLING_CODE): string {
  const raw = (phoneNumber ?? '').trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (raw.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;

  let code = String(countryCallingCode ?? '').replace(/\D/g, '');
  if (code.startsWith('00')) code = code.slice(2);
  if (!code) return `+${digits}`;
  if (digits.startsWith(code) && digits.length - code.length >= 8) return `+${digits}`;
  return `+${code}${digits}`;
}

/** `tel:` link to call a complainant. */
export function phoneCallLink(phoneNumber?: string | null): string {
  return `tel:${normalizePhoneNumber(phoneNumber)}`;
}

/** WhatsApp link to a complainant (the API expects the number without "+"). */
export function whatsAppLink(phoneNumber?: string | null): string {
  return `https://api.whatsapp.com/send?phone=${normalizePhoneNumber(phoneNumber).replace('+', '')}`;
}
