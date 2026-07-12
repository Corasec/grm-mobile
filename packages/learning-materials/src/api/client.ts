import { Category, LearningMaterial, LearningMaterialsListParams, PaginatedResponse } from '../types';

export interface ApiConfig {
  baseURL: string;
  getAuthHeaders?: () => Promise<Record<string, string>>;
}

function buildQueryString(params: LearningMaterialsListParams): string {
  const searchParams = new URLSearchParams();
  if (params.audience) searchParams.set('audience', params.audience);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('page_size', String(params.pageSize));
  if (params.search) searchParams.set('search', params.search);
  if (params.categories && params.categories.length > 0) {
    params.categories.forEach((cat) =>
      searchParams.append('categories', cat)
    );
  }
  if (params.content_type) searchParams.set('content_type', params.content_type);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export class LearningMaterialsApiClient {
  constructor(private config: ApiConfig) {}

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (this.config.getAuthHeaders) {
      const authHeaders = await this.config.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    const response = await fetch(`${this.config.baseURL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async fetchList(
    params: LearningMaterialsListParams = {}
  ): Promise<PaginatedResponse<LearningMaterial>> {
    return this.request<PaginatedResponse<LearningMaterial>>(
      `/api/learning-materials/${buildQueryString(params)}`
    );
  }

  async fetchById(id: string): Promise<LearningMaterial> {
    return this.request<LearningMaterial>(`/api/learning-materials/${id}/`);
  }

  async fetchCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/learning-materials/categories/');
  }
}

let defaultClient: LearningMaterialsApiClient | null = null;

export function configureLearningMaterialsApi(config: ApiConfig): void {
  defaultClient = new LearningMaterialsApiClient(config);
}

export function getApiClient(): LearningMaterialsApiClient {
  if (!defaultClient) {
    throw new Error(
      'Learning Materials API client not configured. Call configureLearningMaterialsApi() first.'
    );
  }
  return defaultClient;
}
