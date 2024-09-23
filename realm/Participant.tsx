import {ObjectSchema} from 'realm';
import BaseRealmObject from './BaseRealmObject';
import {ParticipantMetaRealmObject} from './ParticipantMeta';
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
