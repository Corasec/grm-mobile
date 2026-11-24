import { schemaMigrations, addColumns, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations'
import { TABLE_NAMES } from './tableName';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: TABLE_NAMES.issue,
          columns: [{
            name: 'reject_reason',
            type: 'string',
            isOptional: true,
            isIndexed: false,
          }],
        }),
      ],
    },
    {
      // What an attachment documents (step, rejection, resolution, escalation)
      toVersion: 3,
      steps: [
        addColumns({
          table: TABLE_NAMES.issueAttachment,
          columns: [{ name: 'description', type: 'string', isOptional: true }],
        }),
      ],
    },
  ],
});