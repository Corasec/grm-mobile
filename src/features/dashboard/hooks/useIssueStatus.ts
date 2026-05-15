import { useEffect, useState } from 'react';
import * as IssueStatusService from '@/src/features/dashboard/services/issues/IssueStatusService';
import type { IssueStatus } from '../models/issues/IssueStatus';
import { compareIdsEquivalence } from '@/src/shared/utils/utils';
import { Base } from '@/src/shared/models/Base';
import { Issue } from '../models/issues/Issue';

export function useIssueStatus() {
  const [issueStatusList, setIssueStatusList] = useState<IssueStatus[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssueStatusList();
  }, []);

  const getStatus = (statusName: keyof IssueStatus) => {
    
    if (!issueStatusList) return;
    
    return issueStatusList.find((x) => x[statusName] === true);
  };
  
  const getStatusById = (statusId: string) => {
    
    if (!issueStatusList) return;
    
    return issueStatusList.find((x) => x.id === statusId);
  };

  const fetchIssueStatusList = async () => {
    setLoading(true);
    if (!issueStatusList) {
      const issuesStatusList = await IssueStatusService.fetchIssueStatusList();
      setIssueStatusList(issuesStatusList);
    }
    setLoading(false);
  };

  return { issueStatusList, loading, getStatus, getStatusById};
}
