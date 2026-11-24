import { normalizePhoneNumber, phoneCallLink, whatsAppLink } from './phone';

describe('normalizePhoneNumber', () => {
  it('adds the Benin country code to a national number', () => {
    expect(normalizePhoneNumber('01 97 00 00 00')).toBe('+2290197000000');
  });

  it('keeps numbers already in international format', () => {
    expect(normalizePhoneNumber('+229 01 97 00 00 00')).toBe('+2290197000000');
    expect(normalizePhoneNumber('00229 0197000000')).toBe('+2290197000000');
    expect(normalizePhoneNumber('2290197000000')).toBe('+2290197000000');
  });

  it('never uses the Mali code', () => {
    expect(normalizePhoneNumber('0197000000')).not.toContain('223');
  });

  it('accepts the country code in any format', () => {
    ['229', '+229', '00229'].forEach((code) => {
      expect(normalizePhoneNumber('0197000000', code)).toBe('+2290197000000');
    });
  });

  it('returns an empty string without digits', () => {
    expect(normalizePhoneNumber('')).toBe('');
    expect(normalizePhoneNumber(null)).toBe('');
  });
});

describe('links', () => {
  it('builds the call and WhatsApp links', () => {
    expect(phoneCallLink('01 97 00 00 00')).toBe('tel:+2290197000000');
    expect(whatsAppLink('01 97 00 00 00')).toBe('https://api.whatsapp.com/send?phone=2290197000000');
  });
});
