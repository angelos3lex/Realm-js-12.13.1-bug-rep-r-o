import {ObjectSchema} from 'realm';
import {BaseDBObject} from './BaseDBObject';
import BaseDBObjectArray from './BaseDBObjectArray';
import BaseRealmObject from './BaseRealmObject';
import ParticipantMeta, {ParticipantMetaRealmObject} from './ParticipantMeta';
const {v4: uuidv4} = require('uuid');

export default class Participant extends BaseDBObject {
  private _metaFields?: BaseDBObjectArray<ParticipantMeta, Participant>;

  constructor(dbModel?: ParticipantRealmObject) {
    super(dbModel ?? ({} as ParticipantRealmObject));
  }

  static wrap(dbModel: ParticipantRealmObject): Participant {
    return new Participant(dbModel);
  }

  get dbModel(): ParticipantRealmObject {
    return this._dbModel;
  }

  public getParent(): BaseDBObject | null {
    return null;
  }

  get firstName(): string | undefined {
    return this.dbModel.firstName;
  }

  set firstName(val: string | undefined) {
    this.dbModel.firstName = val;
  }

  get lastName(): string | undefined {
    return this.dbModel.lastName;
  }

  set lastName(val: string | undefined) {
    this.dbModel.lastName = val;
  }

  get metaFields():
    | BaseDBObjectArray<ParticipantMeta, Participant>
    | undefined {
    if (!this._metaFields && this.dbModel.metaFields) {
      const models = new Array<ParticipantMeta>();
      for (const one of Array.from(this.dbModel.metaFields)) {
        models.push(ParticipantMeta.wrap(one));
      }
      this._metaFields = BaseDBObjectArray.createFromArray(
        models,
        this,
        'metaFields',
      );
    }
    return this._metaFields;
  }

  set metaFields(
    val: BaseDBObjectArray<ParticipantMeta, Participant> | undefined,
  ) {
    this._metaFields = val;
    const realmObjectArray = new Array<ParticipantMetaRealmObject>();
    if (val) {
      for (const one of val) {
        realmObjectArray.push(one.dbModel);
      }
    }
    this.dbModel.metaFields = realmObjectArray;
  }

  public putMetaString(key: string, value: string) {
    const metaField: ParticipantMeta | undefined = this.getMeta(key);
    if (metaField !== undefined) {
      metaField.metaValue = value;
    } else {
      if (!this.metaFields) {
        this.metaFields = new BaseDBObjectArray(this, 'metaFields');
      }
      this.metaFields.push(
        ParticipantMeta.create(uuidv4(), key, value.toString()),
      );
    }
  }

  public getMeta(key: string): ParticipantMeta | undefined {
    if (!this.metaFields) {
      return undefined;
    }
    return Array.from(this.metaFields).find(
      metaField =>
        metaField.metaKey &&
        metaField.metaKey.toLowerCase() === key.toLowerCase(),
    );
  }
}

export class ParticipantRealmObject extends BaseRealmObject {
  firstName?: string;
  lastName?: string;

  metaFields?: Array<ParticipantMetaRealmObject>;

  public static schema: ObjectSchema = {
    name: 'Participant',
    primaryKey: 'code',
    properties: {
      code: 'string?',

      firstName: 'string?',
      lastName: 'string?',

      metaFields: 'ParticipantMeta[]',
    },
  };
}
