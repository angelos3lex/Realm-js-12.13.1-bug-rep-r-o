import React from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import {ParticipantRealmObject} from './realm/Participant';
import ParticipantDao from './realm/ParticipantDao';
import {ParticipantMetaRealmObject} from './realm/ParticipantMeta';
import RealmDb from './realm/RealmDb';
const db = RealmDb.instance();

function App(): React.JSX.Element {
  const addAndUpdateParticipant = () => {
    const participantDao = new ParticipantDao(db);

    // first create a Participant realm object
    const participant = {} as ParticipantRealmObject;
    participant.firstName = 'Chandler';
    participant.lastName = 'Bing';
    participant.metaFields = [];

    // then create a participant meta realm object
    const meta = {
      metaKey: 'ADDRESS',
      metaValue: '15 Yemen Road, Yemen',
    } as ParticipantMetaRealmObject;

    // add the meta object to participant
    participant.metaFields.push(meta);

    //save participant (parent dao also saves child meta)
    participantDao.add(participant);

    const code = participant.code;

    // find through db the saved participant object
    let queriedParticipant = participantDao.findByCode(code!)!;

    console.log(
      'metaFields prior to add: ',
      queriedParticipant.metaFields?.length,
    ); // metaFields length will be 1

    // just update the queried participant object, (without any change on it)
    participantDao.add(queriedParticipant);

    // find again through db the saved participant object
    queriedParticipant = participantDao.findByCode(code!)!;
    console.log(
      'metaFields after add: ',
      queriedParticipant.metaFields?.length,
    ); // metaFields length will be 0 (!!!)
  };

  return (
    <SafeAreaView>
      <View style={styles.buttonAlignment}>
        <Button title="Add and Update" onPress={addAndUpdateParticipant} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonAlignment: {marginTop: 50, paddingHorizontal: 50},
});

export default App;
