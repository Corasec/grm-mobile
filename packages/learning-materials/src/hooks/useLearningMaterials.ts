import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Category,
  LearningMaterial,
  LearningMaterialsListParams,
  LearningMaterialAudience,
} from '../types';
import { getApiClient } from '../api/client';
import {
  getCachedList,
  setCachedList,
  getCachedDetail,
  setCachedDetail,
} from '../local/storage';

interface UseLearningMaterialsReturn {
  materials: LearningMaterial[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  categories: Category[];
  categoriesLoading: boolean;
}

export function useLearningMaterials(
  audience?: LearningMaterialAudience,
): UseLearningMaterialsReturn {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const params: LearningMaterialsListParams = {
    audience,
    page: 1,
    pageSize: 20,
  };

  const fetchCategoriesList = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const client = getApiClient();
      const result = await client.fetchCategories();
      setCategoriesList(result);
    } catch {
      // silently fail - categories from materials will be used as fallback
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  const fetchMaterials = useCallback(
    async (pageNum: number, isRefresh: boolean = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (pageNum === 1) setLoading(true);
        setError(null);

        const client = getApiClient();
        const response = await client.fetchList({ ...params, page: pageNum });

        if (pageNum === 1) {
          await setCachedList(params, response.results);
          setMaterials(response.results);
        } else {
          setMaterials((prev) => [...prev, ...response.results]);
        }

        setHasMore(response.next !== null);
        setPage(pageNum);
      } catch (err) {
        const cached = await getCachedList(params);
        if (cached && pageNum === 1) {
          setMaterials(cached);
        }
        setError(err instanceof Error ? err.message : 'Failed to load learning materials');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [audience]
  );

  useEffect(() => {
    fetchMaterials(1);
  }, [fetchMaterials]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchMaterials(page + 1);
  }, [hasMore, loading, page, fetchMaterials]);

  const refresh = useCallback(async () => {
    await fetchMaterials(1, true);
  }, [fetchMaterials]);

  const categories = useMemo(() => {
    if (categoriesList.length > 0) return categoriesList;
    const unique = new Set<string>();
    materials.forEach((m) => {
      if (m.category) unique.add(m.category);
      if (m.categories) m.categories.forEach((c) => unique.add(c));
    });
    return Array.from(unique).sort().map((c) => ({ value: c, label: c }));
  }, [categoriesList, materials]);

  return { materials, loading, refreshing, error, hasMore, fetchMore, refresh, categories, categoriesLoading };
}

interface UseLearningMaterialDetailReturn {
  material: LearningMaterial | null;
  loading: boolean;
  error: string | null;
}

export function useLearningMaterialDetail(
  id: string
): UseLearningMaterialDetailReturn {
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const client = getApiClient();
        const response = await client.fetchById(id);
        await setCachedDetail(id, response);

        if (mounted) setMaterial(response);
      } catch (err) {
        const cached = await getCachedDetail(id);
        if (cached && mounted) {
          setMaterial(cached);
        } else if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load material');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { material, loading, error };
}
