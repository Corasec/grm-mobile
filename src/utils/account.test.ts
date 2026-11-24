import {
  canProcessIssues,
  getAccountLabel,
  getIssueTabs,
  getLocationChoices,
  hasMobileAccountType,
  isCommittee,
  isFacilitator,
} from './account';

const village = { id: 11, name: 'V1', hierarchical_name: 'Bénin / Alibori / Malanville / Guéné / V1' };
const village2 = { id: 12, name: 'V2' };
const commune = { id: 3, name: 'Malanville', hierarchical_name: 'Bénin / Alibori / Malanville' };

const ccgp = {
  account_type: 'committee',
  can_process_issues: true,
  committee: { department: { id: 1, name: 'CCGP' }, administrative_level: { id: 5, name: 'village' } },
  administrative_region: village,
  location: { mode: 'fixed', regions: [village] },
};
const clgp = { ...ccgp, location: { mode: 'list', regions: [commune, village, village2] } };
const national = { ...ccgp, location: { mode: 'free', regions: [] } };
const facilitator = {
  account_type: 'facilitator',
  can_process_issues: false,
  committee: null,
  location: { mode: 'list', regions: [village, village2] },
};
const t = (key: string) => ({ account_type_committee: 'Comité', account_type_facilitator: 'Facilitateur' }[key] ?? key);

describe('account type', () => {
  it('recognises committee and facilitator accounts', () => {
    expect(isCommittee(ccgp)).toBe(true);
    expect(isFacilitator(ccgp)).toBe(false);
    expect(isFacilitator(facilitator)).toBe(true);
    expect(isCommittee(facilitator)).toBe(false);
  });

  it('flags legacy profiles without account type', () => {
    expect(hasMobileAccountType(ccgp)).toBe(true);
    expect(hasMobileAccountType({ village_secretary: true })).toBe(false);
    expect(hasMobileAccountType(null)).toBe(false);
  });
});

describe('canProcessIssues', () => {
  it('lets committees process issues', () => {
    expect(canProcessIssues(ccgp)).toBe(true);
  });

  it('never lets facilitators or unknown profiles process issues', () => {
    expect(canProcessIssues(facilitator)).toBe(false);
    expect(canProcessIssues({ ...facilitator, can_process_issues: true })).toBe(false);
    expect(canProcessIssues(null)).toBe(false);
  });
});

describe('getIssueTabs', () => {
  it('shows the three tabs to committees', () => {
    expect(getIssueTabs(ccgp)).toEqual(['reported', 'assigned', 'resolved']);
  });

  it('shows only reported issues to facilitators', () => {
    expect(getIssueTabs(facilitator)).toEqual(['reported']);
  });
});

describe('getLocationChoices', () => {
  const allRegions = [commune, village, village2];

  it('fixes the location of a village committee', () => {
    expect(getLocationChoices(ccgp, allRegions)).toEqual({ mode: 'fixed', fixedRegion: village, items: [] });
  });

  it('offers the commune and its villages to a commune committee', () => {
    const { mode, items, fixedRegion } = getLocationChoices(clgp, allRegions);
    expect(mode).toBe('list');
    expect(fixedRegion).toBeNull();
    expect(items.map((r) => r.id)).toEqual([3, 11, 12]);
  });

  it('offers the covered villages to a facilitator, with a label for each', () => {
    const { mode, items } = getLocationChoices(facilitator, allRegions);
    expect(mode).toBe('list');
    expect(items.map((r) => r.id)).toEqual([11, 12]);
    expect(items[1].hierarchical_name).toBe('V2');
  });

  it('offers every region to the national committee', () => {
    expect(getLocationChoices(national, allRegions)).toEqual({ mode: 'free', fixedRegion: null, items: allRegions });
  });

  it('falls back to every region when the profile has no location', () => {
    expect(getLocationChoices({}, allRegions).mode).toBe('free');
    expect(getLocationChoices({ location: { mode: 'list', regions: [] } }, allRegions).items).toEqual(allRegions);
  });
});

describe('getAccountLabel', () => {
  it('describes committees with their department and level', () => {
    expect(getAccountLabel(ccgp, t)).toBe('Comité — CCGP (village)');
  });

  it('describes facilitators', () => {
    expect(getAccountLabel(facilitator, t)).toBe('Facilitateur');
  });
});
