import React from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import Participant from './realm/Participant';
import ParticipantDao from './realm/ParticipantDao';
import ParticipantMeta from './realm/ParticipantMeta';
import RealmDb from './realm/RealmDb';
const db = RealmDb.instance();

function App(): React.JSX.Element {
  const addAndUpdateParticipant = () => {
    const participantDao = new ParticipantDao(db);

    const participant = new Participant();
    participant.firstName = 'Chandler';
    participant.lastName = 'Bing';
    participant.putMetaString(ParticipantMeta.ADDRESS, '15 Yemen Road, Yemen');

    participantDao.add(participant);

    const code = participant.code;

    let queriedParticipant = participantDao.findByCode(code!)!;

    console.log(
      'metaFields prior to add: ',
      queriedParticipant.metaFields?.length,
    ); // length will be 1

    participantDao.add(queriedParticipant);

    queriedParticipant = participantDao.findByCode(code!)!;
    console.log(
      'metaFields after add: ',
      queriedParticipant.metaFields?.length,
    ); // length will be 0
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
