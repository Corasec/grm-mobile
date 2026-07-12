export {
  learningMaterialTableSchema,
  LEARNING_MATERIALS_TABLE_NAME,
} from './schema';

export {
  LearningMaterialLocalModel,
  fromRemoteToLocal,
  fromLocalToRemote,
} from './model';

export { LearningMaterialLocalRepository } from './repository';

export { createLearningMaterialSyncable } from './syncable';
