export {
  configureLearningMaterialsApi,
  getApiClient,
  LearningMaterialsApiClient,
} from './api/client';
export type { ApiConfig } from './api/client';

export type {
  Category,
  LearningMaterial,
  LearningMaterialAudience,
  LearningMaterialFileType,
  LearningContentType,
  LearningMaterialsListParams,
  PaginatedResponse,
} from './types';

export { useLearningMaterials, useLearningMaterialDetail } from './hooks/useLearningMaterials';

export { LearningMaterialsList } from './components/LearningMaterialsList';
export { LearningMaterialCard } from './components/LearningMaterialCard';
export { LearningMaterialViewer } from './components/LearningMaterialViewer';

export {
  getCachedList,
  setCachedList,
  getCachedDetail,
  setCachedDetail,
  clearCache,
} from './local/storage';

export { LearningMaterialsScreen } from './screens/LearningMaterialsScreen';
export { LearningMaterialDetailScreen } from './screens/LearningMaterialDetailScreen';

export {
  configureLearningMaterialsTranslations,
  t,
} from './local/translations';
export type { LearningMaterialTranslations } from './local/translations';
