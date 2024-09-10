import {BaseDBObject} from './BaseDBObject';
import BaseRealmObject from './BaseRealmObject';
import RealmDb from './RealmDb';
const {v4: uuidv4} = require('uuid');

export default abstract class Dao<
  T extends BaseDBObject,
  R extends BaseRealmObject,
> {
  protected db: RealmDb;
  protected schema: string;

  constructor(db: RealmDb, schema: string) {
    this.db = db;
    this.schema = schema;
  }

  public add(add: T) {
    try {
      this.prepareAdd(add);
    } catch (e) {
      console.log(e);
    }
    this.executeTransaction(() => this.db.add(add.dbModel, this.schema));
  }

  protected prepareAdd(add: T): void {
    if (!add.code) {
      add.code = uuidv4();
    }
  }

  public getAll(): Array<T> {
    return this.db.findAll<R>(this.schema).map(it => this.wrap(it));
  }

  public findByCode(code: string): T | undefined {
    const realmObject = this.db.findByCode<R>(code, this.schema);
    return realmObject ? this.wrap(realmObject) : undefined;
  }

  public executeTransaction(runnable: Function) {
    this.db.executeTransaction(() => {
      runnable();
    });
  }

  public abstract wrap(dbModel: R): T;
}
