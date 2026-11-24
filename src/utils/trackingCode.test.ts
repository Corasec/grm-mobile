import { buildTrackingCode, maxSequenceForUser, nextTrackingCode } from './trackingCode';

function memoryStorage(initial: Record<string, any> = {}) {
  const data = { ...initial };
  return { data, get: async (k: string) => data[k], set: async (k: string, v: any) => { data[k] = v; } };
}

describe('tracking code', () => {
  it('has the agreed format', () => {
    expect(buildTrackingCode('lac', 17, 4)).toBe('lac17-4');
  });

  it('finds the highest counter of the account only', () => {
    expect(maxSequenceForUser(['lac17-4', 'plaine17-9', 'savane170-50', 'lac1-99', 'lac286', null], 17)).toBe(9);
  });

  it('increments the counter at each issue', async () => {
    const storage = memoryStorage();
    const first = await nextTrackingCode(17, [], storage, () => 0);
    const second = await nextTrackingCode(17, [], storage, () => 0);
    expect(first).toBe('lac17-1');
    expect(second).toBe('lac17-2');
  });

  it('does not restart at 1 after a reinstall: the local issues are taken into account', async () => {
    const storage = memoryStorage(); // empty storage, like a fresh install
    expect(await nextTrackingCode(17, ['colline17-12'], storage, () => 0)).toBe('lac17-13');
  });

  it('never gives the same code to two accounts', async () => {
    const a = await nextTrackingCode(1, [], memoryStorage(), () => 0);
    const b = await nextTrackingCode(11, [], memoryStorage(), () => 0);
    expect(a).not.toBe(b);
  });
});
