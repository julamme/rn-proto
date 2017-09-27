import RNFirebase from 'react-native-firebase';

const config = {
  debug: true,
  persistence: true
};
const firebase = RNFirebase.initializeApp(config);

export const firebaseRefs = {
  users: 'users/',
  locations: 'locations/'
};

export default firebase;
