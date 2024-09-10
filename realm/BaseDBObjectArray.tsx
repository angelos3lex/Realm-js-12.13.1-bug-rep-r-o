import {BaseDBObject} from './BaseDBObject';

export default class BaseDBObjectArray<
  T extends BaseDBObject,
  H extends BaseDBObject,
> extends Array<T> {
  private holder: H;
  private name: string;

  constructor(holder: H, name: string) {
    super();
    this.holder = holder;
    this.name = name;
  }

  push(t: T): number {
    //@ts-ignore
    this.holder.dbModel[this.name].push(t.dbModel);

    return super.push(t);
  }

  pop(): T | undefined {
    //@ts-ignore
    this.holder.dbModel[this.name].pop();

    return super.pop();
  }

  private internalPush(t: T): number {
    return super.push(t);
  }

  public static createFromArray<T extends BaseDBObject, H extends BaseDBObject>(
    array: Array<T>,
    holder: H,
    objName: string,
  ): BaseDBObjectArray<T, H> {
    const dbArray = new BaseDBObjectArray<T, H>(holder, objName);
    array.forEach(i => dbArray.internalPush(i));
    return dbArray;
  }
}
