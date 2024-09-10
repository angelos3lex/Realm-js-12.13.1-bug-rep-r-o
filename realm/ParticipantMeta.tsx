import {BaseDBObject} from './BaseDBObject';
import Participant, {ParticipantRealmObject} from './Participant';
import BaseRealmObject from './BaseRealmObject';
import {ObjectSchema} from 'realm';

export default class ParticipantMeta extends BaseDBObject {
  public static readonly ADDRESS: string = 'patientAddressInfo';

  constructor(dbModel?: ParticipantMetaRealmObject) {
    super(dbModel ?? ({} as ParticipantMetaRealmObject));
  }

  public static create(code: string | null, key: string, value: string) {
    const instance = new ParticipantMeta();
    instance.code = code != null ? code : undefined;
    instance.metaKey = key;
    instance.metaValue = value;
    return instance;
  }

  static wrap(dbModel: ParticipantMetaRealmObject): ParticipantMeta {
    return new ParticipantMeta(dbModel);
  }

  get dbModel(): ParticipantMetaRealmObject {
    return this._dbModel;
  }

  public getParent(): BaseDBObject | null {
    if (!this.dbModel.participant || this.dbModel.participant.length === 0) {
      return null;
    }

    return Participant.wrap(this.dbModel.participant[0]);
  }

  get metaKey(): string | undefined {
    return this.dbModel.metaKey;
  }

  set metaKey(val: string | undefined) {
    this.dbModel.metaKey = val;
  }

  get metaValue(): string | undefined {
    return this.dbModel.metaValue;
  }

  set metaValue(val: string | undefined) {
    this.dbModel.metaValue = val;
  }
}

export class ParticipantMetaRealmObject extends BaseRealmObject {
  metaKey?: string;
  metaValue?: string;
  participant?: Array<ParticipantRealmObject>;

  public static schema: ObjectSchema = {
    name: 'ParticipantMeta',
    primaryKey: 'code',
    properties: {
      code: 'string',

      metaKey: 'string?',
      metaValue: 'string?',
      participant: {
        type: 'linkingObjects',
        objectType: 'Participant',
        property: 'metaFields',
      },
    },
  };
}
