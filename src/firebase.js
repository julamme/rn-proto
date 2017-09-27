import RNFirebase from 'react-native-firebase';

const config = {
  debug: true
};
const firebase = RNFirebase.initializeApp(config);

export default firebase;
