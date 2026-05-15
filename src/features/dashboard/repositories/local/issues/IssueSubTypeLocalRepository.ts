import { BaseLocalRepository } from '../../../../../shared/repositories/BaseLocalRepository';
import { TABLE_NAMES } from "../../../../../shared/migrations/tableName";
import { IssueSubType, IssueSubTypeLocalModel } from "../../../models/issues/IssueSubType";


export class IssueSubTypeLocalRepository extends BaseLocalRepository<IssueSubType> {
  constructor() {
    super(TABLE_NAMES.issueSubType);
  }

  fromRemoteToLocal(issueSubType: any): any {
    if (issueSubType && typeof issueSubType === 'object') {
      const i = issueSubType as Record<string, any>;

      return {
        ...i,
        parent: typeof i.parent === 'object' ? JSON.stringify(i.parent) : i.parent,
      };
    }
    return null;
  }

  fromLocalToRemote(localModel: IssueSubTypeLocalModel): IssueSubType {
    return {
      id: localModel.id,
      name: localModel.name,
      created_date: localModel.created_date,
      updated_date: localModel.updated_date,
      parent: localModel.parent,
    };
  }
}
