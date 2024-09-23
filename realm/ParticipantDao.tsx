import Dao from './Dao';
import {ParticipantRealmObject} from './Participant';
import ParticipantMetaDao from './ParticipantMetaDao';
import RealmDb from './RealmDb';

export default class ParticipantDao extends Dao<ParticipantRealmObject> {
  private metaDao: ParticipantMetaDao;

  constructor(db: RealmDb) {
    super(db, ParticipantRealmObject.schema.name);
    this.metaDao = new ParticipantMetaDao(db);
  }

  public add(add: ParticipantRealmObject) {
    this.db.executeTransaction(() => {
      if (add.metaFields) {
        Array.from(add.metaFields).forEach(meta => this.metaDao.add(meta));
      }

      super.add(add);
    });
  }
}
