import AsyncStorage from '@react-native-async-storage/async-storage';
import { LearningMaterial, LearningMaterialsListParams } from '../types';

const CACHE_KEY = 'grm-learning-materials-cache';
const CACHE_EXPIRY_MS = 30 * 60 * 1000;

interface CacheEntry {
  data: LearningMaterial[];
  params: LearningMaterialsListParams;
  timestamp: number;
}

interface DetailCache {
  [id: string]: {
    data: LearningMaterial;
    timestamp: number;
  };
}

const DETAIL_CACHE_KEY = 'grm-learning-materials-detail-cache';

async function getCache(): Promise<CacheEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_EXPIRY_MS) return null;
    return entry;
  } catch {
    return null;
  }
}

async function setCache(entry: CacheEntry): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
  }
}

async function getDetailCache(): Promise<DetailCache | null> {
  try {
    const raw = await AsyncStorage.getItem(DETAIL_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function setDetailCache(entry: DetailCache): Promise<void> {
  try {
    await AsyncStorage.setItem(DETAIL_CACHE_KEY, JSON.stringify(entry));
  } catch {
  }
}

export async function getCachedList(
  params: LearningMaterialsListParams
): Promise<LearningMaterial[] | null> {
  const cache = await getCache();
  if (!cache) return null;

  const paramsMatch =
    cache.params.audience === params.audience &&
    cache.params.search === params.search;

  if (!paramsMatch) return null;

  return cache.data;
}

export async function setCachedList(
  params: LearningMaterialsListParams,
  data: LearningMaterial[]
): Promise<void> {
  await setCache({ data, params, timestamp: Date.now() });
}

export async function getCachedDetail(
  id: string
): Promise<LearningMaterial | null> {
  const cache = await getDetailCache();
  if (!cache || !cache[id]) return null;
  if (Date.now() - cache[id].timestamp > CACHE_EXPIRY_MS) return null;
  return cache[id].data;
}

export async function setCachedDetail(
  id: string,
  data: LearningMaterial
): Promise<void> {
  const cache = (await getDetailCache()) || {};
  cache[id] = { data, timestamp: Date.now() };
  await setDetailCache(cache);
}

export async function clearCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(DETAIL_CACHE_KEY);
  } catch {
  }
}
