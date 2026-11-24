import { isIssueClosed } from './issueStatus';

jest.mock('./utils', () => ({ compareIdsEquivalence: (a: any, b: any) => String(a) === String(b) }));

const statuses = [
  { id: 1, initial_status: true },
  { id: 2, open_status: true },
  { id: 3, rejected_status: true },
  { id: 4, final_status: true },
];

describe('isIssueClosed', () => {
  it('detects resolved and rejected issues from the status flags', () => {
    expect(isIssueClosed({ id: 4, final_status: true })).toBe(true);
    expect(isIssueClosed({ id: 3, rejected_status: true })).toBe(true);
  });

  it('reads the flags from the status list when only an id is known', () => {
    expect(isIssueClosed({ id: '4' }, statuses)).toBe(true);
    expect(isIssueClosed(3, statuses)).toBe(true);
  });

  it('keeps open issues editable', () => {
    expect(isIssueClosed({ id: 2 }, statuses)).toBe(false);
    expect(isIssueClosed(1, statuses)).toBe(false);
    expect(isIssueClosed(null, statuses)).toBe(false);
  });
});
