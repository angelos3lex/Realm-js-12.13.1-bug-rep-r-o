import Realm from 'realm';

export default abstract class BaseRealmObject extends Realm.Object {
  code?: string;
}
