import BaseRealmObject from './BaseRealmObject';
import RealmDb from './RealmDb';
const {v4: uuidv4} = require('uuid');

export default abstract class Dao<R extends BaseRealmObject> {
  protected db: RealmDb;
  protected schema: string;

  constructor(db: RealmDb, schema: string) {
    this.db = db;
    this.schema = schema;
  }

  public add(add: R) {
    try {
      this.prepareAdd(add);
    } catch (e) {
      console.log(e);
    }
    this.executeTransaction(() => this.db.add(add, this.schema));
  }

  protected prepareAdd(add: R): void {
    if (!add.code) {
      add.code = uuidv4();
    }
  }

  public getAll(): Array<R> {
    return this.db.findAll<R>(this.schema);
  }

  public findByCode(code: string): R | undefined {
    return this.db.findByCode<R>(code, this.schema);
  }

  public executeTransaction(runnable: Function) {
    this.db.executeTransaction(() => {
      runnable();
    });
  }
}
