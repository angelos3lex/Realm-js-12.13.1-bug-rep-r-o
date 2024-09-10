import Dao from './Dao';
import ParticipantMeta, {ParticipantMetaRealmObject} from './ParticipantMeta';
import RealmDb from './RealmDb';

export default class ParticipantMetaDao extends Dao<
  ParticipantMeta,
  ParticipantMetaRealmObject
> {
  constructor(db: RealmDb) {
    super(db, ParticipantMetaRealmObject.schema.name);
  }

  public wrap(dbModel: ParticipantMetaRealmObject): ParticipantMeta {
    return ParticipantMeta.wrap(dbModel);
  }
}
