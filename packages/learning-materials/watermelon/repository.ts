import { Model, Q, RawRecord } from '@nozbe/watermelondb';
import { BaseLocalRepository } from '../../../src/repositories/shared/BaseLocalRepository';
import { LEARNING_MATERIALS_TABLE_NAME } from './schema';
import { LearningMaterialLocalModel, fromRemoteToLocal, fromLocalToRemote } from './model';
import { LearningMaterial } from '../src/types';

export class LearningMaterialLocalRepository extends BaseLocalRepository<LearningMaterial> {
  constructor() {
    super(LEARNING_MATERIALS_TABLE_NAME);
  }

  fromRemoteToLocal(item: any, parentId?: string | number): RawRecord {
    return fromRemoteToLocal(item) as unknown as RawRecord;
  }

  fromLocalToRemote(localModel: Model): LearningMaterial {
    return fromLocalToRemote(localModel as unknown as LearningMaterialLocalModel);
  }

  async fetchByAudience(audience: string): Promise<LearningMaterial[]> {
    const dbInstance = (await import('../../../src/utils/storageManager')).databaseServiceInstance.database;
    const results: Model[] = await dbInstance
      .get(LEARNING_MATERIALS_TABLE_NAME)
      .query(
        Q.where('audience', Q.oneOf([audience, 'both'])),
        Q.sortBy('sort_order', Q.asc),
        Q.sortBy('created_date', Q.desc)
      )
      .fetch();

    return results.map((r) => this.fromLocalToRemote(r));
  }
}
