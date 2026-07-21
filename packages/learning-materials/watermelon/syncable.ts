import { BaseService } from '../../../src/services/shared/BaseService';
import { Syncable } from '../../../src/services/shared/types';
import { LEARNING_MATERIALS_TABLE_NAME } from './schema';
import { LearningMaterialLocalRepository } from './repository';
import { LearningMaterialsApiClient } from '../src/api/client';
import { LearningMaterial } from '../src/types';

export function createLearningMaterialSyncable(
  apiClient: LearningMaterialsApiClient
): Syncable {
  const localRepository = new LearningMaterialLocalRepository();

  class LearningMaterialRemoteRepository {
    async fetchAll(
      endpointType?: string | null,
      _sortBy?: string | null,
      _sortOrder?: any,
      page?: number | null,
      _limit?: number | null,
      allPages?: boolean | null,
      created_date?: number | null,
      updated_date?: number | null,
      _deleted_date?: number | null,
      _parentId?: string | null,
      search_param?: string | null
    ): Promise<LearningMaterial[]> {
      const audience = endpointType || undefined;
      // Convert Watermelon timestamps to ISO for the API
      const params: any = { page: page || 1, pageSize: allPages ? 100 : 20 };
      if (audience) params.audience = audience;
      if (search_param) params.search = search_param;

      const response = await apiClient.fetchList(params);
      return response.results;
    }
  }

  const remoteRepository = new LearningMaterialRemoteRepository() as any;
  const service = new BaseService<LearningMaterial>(localRepository, remoteRepository);

  return {
    pushChanges: ({ changes, lastPulledAt }) =>
      service.pushChanges({ changes, lastPulledAt }),
    pullChanges: ({ tableName, lastPulledAt, forceFetchAllPages, parentChanges }) =>
      service.pullChanges({
        tableName,
        lastPulledAt,
        forceFetchAllPages,
        parentChanges,
      }),
    tableName: LEARNING_MATERIALS_TABLE_NAME,
  };
}
