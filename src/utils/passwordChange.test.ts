import { validatePasswordChange } from './passwordChange';

describe('validatePasswordChange', () => {
  const ok = { current: 'Initial2026', next: 'MonVillage7', confirm: 'MonVillage7' };

  it('accepts a valid form', () => {
    expect(validatePasswordChange(ok)).toBeNull();
  });

  it('requires every field', () => {
    expect(validatePasswordChange({ ...ok, current: '' })).toBe('password_change_fill_all');
    expect(validatePasswordChange({ ...ok, confirm: '' })).toBe('password_change_fill_all');
  });

  it('applies the rule: 8 characters with letters and digits', () => {
    for (const next of ['court1', 'sanschiffres', '12345678']) {
      expect(validatePasswordChange({ ...ok, next, confirm: next })).toBe('password_change_rule');
    }
  });

  it('requires the confirmation to match', () => {
    expect(validatePasswordChange({ ...ok, confirm: 'MonVillage8' })).toBe('password_change_mismatch');
  });

  it('requires a different password', () => {
    expect(validatePasswordChange({ current: 'Initial2026', next: 'Initial2026', confirm: 'Initial2026' })).toBe(
      'password_change_same'
    );
  });
});
