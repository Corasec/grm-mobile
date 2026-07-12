
# GRM Learning Materials

A reusable React Native package for displaying learning materials (PDF, JPG, PNG) in GRM mobile apps. Supports audience targeting (facilitator / citizen / both).

## Installation

```bash
npm install grm-learning-materials
# or
yarn add grm-learning-materials
```

### Peer Dependencies

Ensure these are installed in your host app:

- `react` >= 18.0.0
- `react-native` >= 0.74.0
- `react-native-paper` >= 4.0.0
- `@react-navigation/native` >= 7.0.0
- `@react-navigation/stack` >= 7.0.0
- `axios` >= 0.21.0
- `@react-native-async-storage/async-storage` >= 1.23.0
- `expo-file-system` >= 17.0.0

## Quick Start

### 1. Configure the API client

Call this once at app startup (e.g., in `App.js` or `index.js`):

```tsx
import { configureLearningMaterialsApi } from 'grm-learning-materials';

configureLearningMaterialsApi({
  baseURL: 'https://your-api.example.com',
  getAuthHeaders: async () => {
    const token = await getAuthToken(); // your auth logic
    return { Authorization: `Bearer ${token}` };
  },
});
```

### 2. Register navigation screens

Add these screens to your navigation stack:

```tsx
import { LearningMaterialsScreen, LearningMaterialDetailScreen } from 'grm-learning-materials';

// In your navigator:
<Stack.Screen
  name="LearningMaterials"
  component={LearningMaterialsScreen}
  initialParams={{ audience: 'facilitator', title: 'Mes formations' }}
/>
<Stack.Screen
  name="LearningMaterialDetail"
  component={LearningMaterialDetailScreen}
/>
```

### 3. For facilitators (filtered view)

```tsx
<LearningMaterialsScreen
  audience="facilitator"
  title="Documents du facilitateur"
/>
```

### 4. For citizens (filtered view)

```tsx
<LearningMaterialsScreen
  audience="citizen"
  title="Documents citoyens"
/>
```

## Using Components Directly

You can use the lower-level components if you need custom layouts:

```tsx
import {
  LearningMaterialsList,
  useLearningMaterials,
  LearningMaterialViewer,
} from 'grm-learning-materials';

function MyFacilitatorScreen() {
  const { materials, loading, refreshing, error, hasMore, fetchMore, refresh } =
    useLearningMaterials('facilitator');

  return (
    <LearningMaterialsList
      materials={materials}
      loading={loading}
      refreshing={refreshing}
      error={error}
      hasMore={hasMore}
      onRefresh={refresh}
      onLoadMore={fetchMore}
      onMaterialPress={(material) => navigation.navigate('Detail', { materialId: material.id })}
    />
  );
}
```

## API

### `configureLearningMaterialsApi(config: ApiConfig)`

Configure the API client. Must be called before using any hooks or screens.

### `useLearningMaterials(audience?: LearningMaterialAudience)`

React hook for fetching a paginated list of learning materials.

Returns: `{ materials, loading, refreshing, error, hasMore, fetchMore, refresh }`

### `useLearningMaterialDetail(id: string)`

React hook for fetching a single learning material by ID.

Returns: `{ material, loading, error }`

## WatermelonDB Integration (Optional)

If your app uses WatermelonDB for offline storage, the package provides optional integration:

```tsx
// In your app schema:
import { learningMaterialTableSchema } from 'grm-learning-materials/watermelon';
import { appSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
  tables: [
    // ... existing tables
    learningMaterialTableSchema,
  ],
});
```

```tsx
// In your database initialization:
import { LearningMaterialLocalModel } from 'grm-learning-materials/watermelon';

// Add to modelClasses:
modelClasses: [
  // ... existing models
  LearningMaterialLocalModel,
],
```

```tsx
// In your sync service:
import { createLearningMaterialSyncable } from 'grm-learning-materials/watermelon';
import { getApiClient } from 'grm-learning-materials';

syncServiceInstance.register(
  createLearningMaterialSyncable(getApiClient())
);
```

See `API_CONTRACT.md` for the full backend API specification.
