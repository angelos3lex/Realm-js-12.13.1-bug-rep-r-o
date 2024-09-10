import BaseRealmObject from './BaseRealmObject';
export abstract class BaseDBObject {
  protected _dbModel: BaseRealmObject;

  constructor(dbModel: BaseRealmObject) {
    this._dbModel = dbModel;
  }

  get code(): string | undefined {
    return this._dbModel.code;
  }

  set code(val: string | undefined) {
    this._dbModel.code = val;
  }

  abstract getParent(): BaseDBObject | null;
  abstract dbModel: BaseRealmObject;
}
