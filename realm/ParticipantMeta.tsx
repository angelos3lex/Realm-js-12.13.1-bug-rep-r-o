import {ObjectSchema} from 'realm';
import BaseRealmObject from './BaseRealmObject';
import {ParticipantRealmObject} from './Participant';

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
