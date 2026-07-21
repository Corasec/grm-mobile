import { Model } from '@nozbe/watermelondb';
import { text, field, date, json } from '@nozbe/watermelondb/decorators';
import { LEARNING_MATERIALS_TABLE_NAME } from './schema';
import { LearningMaterial, LearningMaterialAudience, LearningMaterialFileType } from '../src/types';

export class LearningMaterialLocalModel extends Model {
  static table = LEARNING_MATERIALS_TABLE_NAME;

  @text('title') title: string;
  @text('description') description?: string;
  @text('file_url') file_url: string;
  @text('file_type') file_type: string;
  @text('thumbnail_url') thumbnail_url?: string;
  @text('audience') audience: string;
  @field('sort_order') sort_order?: number;
  @date('created_date') created_date: Date;
  @date('updated_date') updated_date: Date;
  @date('sync_date') sync_date?: Date;
  @date('deleted_date') deleted_date?: Date;
}

export function fromRemoteToLocal(item: any): Record<string, any> {
  return {
    id: String(item.id),
    title: item.title,
    description: item.description || null,
    file_url: item.file,
    file_type: item.file_type,
    thumbnail_url: item.thumbnail || null,
    audience: item.audience,
    sort_order: item.sort_order ?? null,
    created_date: new Date(item.created_date).getTime(),
    updated_date: new Date(item.updated_date || item.created_date).getTime(),
    sync_date: Date.now(),
    deleted_date: item.deleted_date ? new Date(item.deleted_date).getTime() : null,
  };
}

export function fromLocalToRemote(model: LearningMaterialLocalModel): LearningMaterial {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    file: model.file_url,
    file_type: model.file_type as LearningMaterialFileType,
    thumbnail: model.thumbnail_url,
    audience: model.audience as LearningMaterialAudience,
    sort_order: model.sort_order,
    created_date: new Date(model.created_date).toISOString(),
    updated_date: model.updated_date ? new Date(model.updated_date).toISOString() : undefined,
  };
}
