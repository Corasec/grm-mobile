import { tableSchema, TableSchema } from '@nozbe/watermelondb';

export const LEARNING_MATERIALS_TABLE_NAME = 'learning_materials';

export const learningMaterialTableSchema: TableSchema = tableSchema({
  name: LEARNING_MATERIALS_TABLE_NAME,
  columns: [
    { name: 'created_date', type: 'number' },
    { name: 'deleted_date', type: 'number', isOptional: true },
    { name: 'updated_date', type: 'number' },
    { name: 'sync_date', type: 'number', isOptional: true },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string', isOptional: true },
    { name: 'file_url', type: 'string' },
    { name: 'file_type', type: 'string' },
    { name: 'thumbnail_url', type: 'string', isOptional: true },
    { name: 'audience', type: 'string' },
    { name: 'sort_order', type: 'number', isOptional: true },
  ],
});
