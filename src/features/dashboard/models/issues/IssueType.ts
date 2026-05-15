import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
import { TABLE_NAMES } from "../../../../shared/migrations/tableName";
import { Base } from "../../../../shared/models/Base";

export interface IssueType extends Base {}

export class IssueTypeLocalModel extends Model {
  static table =  TABLE_NAMES.issueType;

  // @ts-ignore
  @text('created_date') created_date;
  // @ts-ignore
  @text('updated_date') updated_date;
  // @ts-ignore
  @text('name') name;
}
