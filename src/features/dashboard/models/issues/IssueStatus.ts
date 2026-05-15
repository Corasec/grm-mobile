import { Model } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';
import { TABLE_NAMES } from "../../../../shared/migrations/tableName";
import { Base } from "../../../../shared/models/Base";

export interface IssueStatus extends Base {
  final_status: boolean;
  initial_status: boolean;
  rejected_status: boolean;
  open_status: boolean;
}

export class IssueStatusLocalModel extends Model {
  static table = TABLE_NAMES.issueStatus;

  // @ts-ignore
  @text('created_date') created_date;
  // @ts-ignore
  @text('name') name;
  // @ts-ignore
  @field('final_status') final_status;
  // @ts-ignore
  @field('initial_status') initial_status;
  // @ts-ignore
  @field('rejected_status') rejected_status;
  // @ts-ignore
  @field('open_status') open_status;

}
