export type LearningMaterialAudience = 'facilitator' | 'citizen' | 'both';

export type LearningMaterialFileType = 'pdf' | 'jpg' | 'png';

export type LearningContentType =
  | 'article'
  | 'video'
  | 'pdf';

export interface Category {
  value: string;
  label: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description?: string;
  file: string;
  file_type: LearningMaterialFileType;
  thumbnail?: string;
  audience: LearningMaterialAudience;
  created_date: string;
  updated_date?: string;
  sort_order?: number;
  category?: string;
  categories?: string[];
  tags?: string[];
  duration?: string;
  content_type?: LearningContentType;
  author?: string;
  source?: string;
  publication_date?: string;
  learning_objectives?: string[];
  content_url?: string;
}

export interface LearningMaterialsListParams {
  audience?: LearningMaterialAudience;
  page?: number;
  pageSize?: number;
  search?: string;
  categories?: string[];
  content_type?: LearningContentType;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type FileViewerMode = 'pdf' | 'image';
