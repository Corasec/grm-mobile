import IssueStatusRemoteRepository from '../../repositories/remote/issues/IssueStatusRemoteRepository';
import { BaseService } from '@/src/shared/services/BaseService';
import {
  IssueStatusLocalRepository,
} from '../../repositories/local/issues/IssueStatusLocalRepository';
import { IssueStatus } from '../../models/issues/IssueStatus';
import { TABLE_NAMES } from "@/src/shared/migrations/tableName";
import { Syncable } from '@/src/shared/services/types';

const localRepository = new IssueStatusLocalRepository();
const remoteRepository = new IssueStatusRemoteRepository();
  
const issueStatusService = new BaseService<IssueStatus>(localRepository, remoteRepository);

export async function fetchIssueStatusList(): Promise<IssueStatus[]> {
  try {
    const list = await issueStatusService.getAll();
    
    return list
  } catch (error) {
    console.error('Error syncing issues statuses:', error);
  }
}

export const issueStatusSyncable: Syncable = {
  pushChanges: ({ changes, lastPulledAt }) =>
    issueStatusService.pushChanges({ changes, lastPulledAt }),
  pullChanges: ({ tableName, lastPulledAt }) => issueStatusService.pullChanges({ tableName, lastPulledAt }),
  tableName:  TABLE_NAMES.issueStatus,
};
