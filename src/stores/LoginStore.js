//@flow
import { observable, action, computed } from 'mobx';
import firebase, { firebaseRefs } from './../firebase';
import Geofire from 'geofire';

const auth = {
  provider: 'facebook'
};

export default class LoginStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable fbLogin = null;
  @observable firebaseUser = null;

  @action
  logout: () => void = () => {
    this.fbLogin = null;
    this.firebaseUser = null;
  };

  @action
  authWithFb: (response: any) => void = response => {
    this.fbLogin = response;
    if (this.firebaseUser === null) {
      this.firebaseLoginWithAccessToken();
    }
  };

  @action
  authenticate: () => void = () => {
    //UNUSED
    /*if (this.accessToken) {
      this.firebaseLoginWithAccessToken();
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        if (data) {
          this.accessToken = data.accessToken;
          this.firebaseLoginWithAccessToken();
        }
      });
    }*/
  };

  firebaseLoginWithAccessToken() {
    console.log(this.fbLogin);
    console.log('login to firebase');
    const credential = firebase.auth.FacebookAuthProvider.credential(
      this.fbLogin.credentials.token
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(user => {
        if (user) {
          this.firebaseUser = user;
          console.log(user);
          firebase
            .database()
            .ref(`${firebaseRefs.users}/${user.uid}`)
            .update(user);
        }
      })
      .catch(error => console.error('Sign in error to firebase', error));
  }
}
