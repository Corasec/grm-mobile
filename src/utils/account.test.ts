import {
  canProcessIssues,
  getCoveredVillages,
  getLocationLabel,
  getReporterCounters,
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
const t = (key: string) =>
  ({
    account_type_committee: 'Comité',
    account_type_facilitator: 'Facilitateur',
    field_role_fc: 'Facilitateur communautaire (FC)',
    field_role_sc: 'Superviseur communal (SC)',
  }[key] ?? key);

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

describe('field staff role', () => {
  it('shows the exact role of field staff', () => {
    expect(getAccountLabel({ ...facilitator, field_role: 'FC' }, t)).toBe('Facilitateur communautaire (FC)');
    expect(getAccountLabel({ ...facilitator, field_role: 'SC' }, t)).toBe('Superviseur communal (SC)');
  });
});

describe('getLocationLabel', () => {
  it('prefers the full location', () => {
    expect(getLocationLabel(ccgp)).toBe('Bénin / Alibori / Malanville / Guéné / V1');
    expect(getLocationLabel({ administrative_region: { id: 1, name: 'Bénin' } })).toBe('Bénin');
    expect(getLocationLabel(null)).toBe('');
  });
});

describe('getCoveredVillages', () => {
  it('lists the covered villages of field staff only', () => {
    expect(getCoveredVillages(facilitator).map((r) => r.id)).toEqual([11, 12]);
    expect(getCoveredVillages(clgp)).toEqual([]);
  });
});

describe('getReporterCounters', () => {
  const statuses = [
    { id: 1 },
    { id: 2 },
    { id: 3, rejected_status: true },
    { id: 4, final_status: true },
  ];
  it('counts reported, in progress and closed issues of the reporter', () => {
    const issues = [
      { reporter: { id: 7 }, status: { id: 1 } },
      { reporter: { id: 7 }, status: { id: 4 } },
      { reporter: 7, status: 3 },
      { reporter: { id: 8 }, status: { id: 1 } },
    ];
    expect(getReporterCounters(issues, 7, statuses)).toEqual({ reported: 3, inProgress: 1, closed: 2 });
  });
});
