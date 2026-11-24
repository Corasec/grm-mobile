import { citizenToBackend } from './IssueRemoteRepository';

jest.mock('../../../utils/request', () => ({ __esModule: true, default: jest.fn() }));

describe('citizenToBackend', () => {
  it('sends the gender with the citizen', () => {
    const payload = citizenToBackend({ name: 'Awa', type: null, gender: 'female', age_group: { id: 2 }, group: 5, group_2: null });
    expect(payload).toEqual({ name: 'Awa', type: null, gender: 'female', age_group: 2, group: 5, group_2: null });
  });

  it('sends no gender when it was not given', () => {
    expect(citizenToBackend({ name: '', age_group: null }).gender).toBeNull();
  });

  it('returns null without citizen', () => {
    expect(citizenToBackend(null)).toBeNull();
  });
});
