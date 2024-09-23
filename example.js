import Realm from "realm";
import { v4 as uuidv4 } from "uuid";

class RealmDb {
    static instanceObj;

    static instance() {
        if (RealmDb.instanceObj == null) {
            RealmDb.instanceObj = new RealmDb();
            RealmDb.instanceObj.realm = new Realm({
                path: "example_db.realm",
                schema: [
                    ParticipantRealmObject.schema,
                    ParticipantMetaRealmObject.schema,
                ],
                schemaVersion: 1,
            });
        }

        return RealmDb.instanceObj;
    }

    _realm;

    set realm(realm) {
        this._realm = realm;
    }

    executeTransaction(runnable) {
        this.beginTransaction();
        runnable();
        this.commitTransaction();
    }

    add(obj, schema) {
        this.executeTransaction(() => {
            if (!obj.code) {
                obj.code = uuidv4();
            }
            this._realm.create(schema, obj, Realm.UpdateMode.All);
        });
    }

    findByCode(code, schema) {
        return this._realm.objects(schema).filtered("code == $0", code)[0];
    }

    beginTransaction() {
        if (!this._realm.isInTransaction) {
            this._realm.beginTransaction();
        }
    }

    commitTransaction() {
        if (this._realm.isInTransaction) {
            this._realm.commitTransaction();
        }
    }
}

class ParticipantRealmObject extends Realm.Object {
    code;
    firstName;
    lastName;

    metaFields;

    static schema = {
        name: "Participant",
        primaryKey: "code",
        properties: {
            code: "string?",

            firstName: "string?",
            lastName: "string?",

            metaFields: "ParticipantMeta[]",
        },
    };
}

class ParticipantMetaRealmObject extends Realm.Object {
    code;
    metaKey;
    metaValue;
    participant;

    static schema = {
        name: "ParticipantMeta",
        primaryKey: "code",
        properties: {
            code: "string",

            metaKey: "string?",
            metaValue: "string?",
            participant: {
                type: "linkingObjects",
                objectType: "Participant",
                property: "metaFields",
            },
        },
    };
}

const db = RealmDb.instance();

// first create a Participant realm object
const participant = {};
participant.firstName = "Chandler";
participant.lastName = "Bing";
participant.metaFields = [];

// then create a participant meta realm object
const meta = {
    metaKey: "ADDRESS",
    metaValue: "15 Yemen Road, Yemen",
};

// add the meta object to participant
participant.metaFields.push(meta);

//save participant (also saves children meta)
db.executeTransaction(() => {
    Array.from(participant.metaFields).forEach((meta) =>
        db.add(meta, ParticipantMetaRealmObject.schema.name)
    );

    db.add(participant, ParticipantRealmObject.schema.name);
});

const code = participant.code;
// find through db the saved participant object
let queriedParticipant = db.findByCode(
    code,
    ParticipantRealmObject.schema.name
);

console.log("metaFields prior to add: ", queriedParticipant.metaFields?.length); // metaFields length will be 1

// just update the queried participant object, (without any change on it)
db.executeTransaction(() => {
    Array.from(queriedParticipant.metaFields).forEach((meta) =>
        db.add(meta, ParticipantMetaRealmObject.schema.name)
    );

    db.add(queriedParticipant, ParticipantRealmObject.schema.name);
});

// find again through db the saved participant object
queriedParticipant = db.findByCode(code, ParticipantRealmObject.schema.name);
console.log("metaFields after add: ", queriedParticipant.metaFields?.length); // metaFields length will be 0 (!!!)
