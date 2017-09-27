//@flow
import { observable, action, computed } from 'mobx';
import { AccessToken } from 'react-native-fbsdk';
import firebase from './../firebase';

const auth = {
  provider: 'facebook'
};

export default class LoginStore {
  @observable accessToken = null;
  @observable firebaseUser = null;

  @action
  loginWithAccessToken: (fbResponse: ?Object) => void = fbResponse => {
    console.log(fbResponse);
    this.accessToken = fbResponse;
    this.firebaseLoginWithAccessToken();
  };

  @action
  authenticate: () => void = () => {
    if (this.accessToken) {
      this.firebaseLoginWithAccessToken();
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        if (data.accessToken) {
          this.accessToken = data.accessToken;
          this.firebaseLoginWithAccessToken();
        }
      });
    }
  };

  firebaseLoginWithAccessToken() {
    console.log(this.accessToken);
    const credential = firebase.auth.FacebookAuthProvider.credential(
      this.accessToken
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(user => {
        if (user) {
          this.firebaseUser = user;
        }
      })
      .catch(error => console.error('Sign in error to firebase', error));
  }
}
