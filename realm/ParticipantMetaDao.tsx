import Dao from './Dao';
import {ParticipantMetaRealmObject} from './ParticipantMeta';
import RealmDb from './RealmDb';

export default class ParticipantMetaDao extends Dao<ParticipantMetaRealmObject> {
  constructor(db: RealmDb) {
    super(db, ParticipantMetaRealmObject.schema.name);
  }
}
