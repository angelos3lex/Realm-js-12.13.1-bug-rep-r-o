import Dao from './Dao';
import Participant, {ParticipantRealmObject} from './Participant';
import ParticipantMetaDao from './ParticipantMetaDao';
import RealmDb from './RealmDb';

export default class ParticipantDao extends Dao<
  Participant,
  ParticipantRealmObject
> {
  private metaDao: ParticipantMetaDao;

  constructor(db: RealmDb) {
    super(db, ParticipantRealmObject.schema.name);
    this.metaDao = new ParticipantMetaDao(db);
  }

  public wrap(dbModel: ParticipantRealmObject): Participant {
    return Participant.wrap(dbModel);
  }

  public add(add: Participant) {
    this.db.executeTransaction(() => {
      if (add.metaFields) {
        Array.from(add.metaFields).forEach(meta => this.metaDao.add(meta));
      }

      super.add(add);
    });
  }
}
