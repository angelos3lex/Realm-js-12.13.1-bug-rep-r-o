import Realm from 'realm';
import RealmModule from './RealmModule';
import BaseRealmObject from './BaseRealmObject';

export default class RealmDb {
  private static instanceObj: RealmDb;

  public static instance(): RealmDb {
    if (RealmDb.instanceObj == null) {
      RealmDb.instanceObj = new RealmDb();
      RealmDb.instanceObj.realm = new Realm({
        path: 'example_db.realm',
        schema: RealmModule,
        schemaVersion: 1,
      });
    }

    return RealmDb.instanceObj;
  }

  private _realm!: Realm;

  protected set realm(realm: Realm) {
    this._realm = realm;
  }

  public executeTransaction(runnable: Function) {
    this.beginTransaction();
    runnable();
    this.commitTransaction();
  }

  public add<T extends BaseRealmObject>(obj: T, schema: string) {
    this.executeTransaction(() =>
      this._realm.create(schema, obj, Realm.UpdateMode.All),
    );
  }

  public findAll<T extends BaseRealmObject>(schema: string): Array<T> {
    return Array.from(this._realm.objects<T>(schema));
  }

  public findByCode<T extends BaseRealmObject>(
    code: string,
    schema: string,
  ): T | undefined {
    return this.createQuery<T>(schema).filtered('code == $0', code)[0];
  }

  public createQuery<T extends BaseRealmObject>(
    schema: string,
  ): Realm.Results<T> {
    // @ts-ignore
    return this._realm.objects<T>(schema);
  }

  /**
   * Internally lots of methods can request a transaction to begin, eg methods doing stuff in a transaction when used by another method
   * that wants to do more stuff in a transaction. By using beginTransaction()/commitTransaction() is like creating blocks of stuff to be
   * done in the same transaction.
   */

  /**
   * Holds the times a transaction has been requested to begin
   */
  private transactionCounter: number = 0;
  /**
   * If this began the transaction, the native realm might have done it as well through a {@link Realm#beginTransaction()}
   */
  private beganTransaction: boolean = false;

  private beginTransaction(): void {
    if (this.transactionCounter == 0 && !this.beganTransaction) {
      this._realm.beginTransaction();
      this.beganTransaction = true;
    }
    this.transactionCounter++;
  }

  private commitTransaction(): void {
    if (this.transactionCounter == 1 && this.beganTransaction) {
      this._realm.commitTransaction();
      this.beganTransaction = false;
    }
    this.transactionCounter--;
  }
}
