/**
 * @flow  
 */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import firebase from 'react-native-firebase';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  }
});

type State = {
  isLoggedIn: boolean,
  currentToken: ?AccessToken
};

@inject('loginStore')
@observer
export default class LoginContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.loginStore.firebaseUser === null) {
      console.log('firebaseuser was null');
      this.props.loginStore.authenticate();
    }
  }
  componentDidUpdate() {
    if (this.props.loginStore.firebaseUser) {
      this.props.navigation.navigate('Main');
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const hasChanges = [
      nextProps.loginStore.accessToken !== this.props.loginStore.accessToken,
      nextProps.loginStore.firebaseUser !== this.props.loginStore.firebaseUser
    ];

    console.log(hasChanges);

    return hasChanges.map(item => item);
  }
  render() {
    const { loginStore } = this.props;
    if (loginStore.firebaseUser) {
      return <View />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ padding: 4, fontSize: 28 }}> Hotel relief</Text>
          <LoginButton
            readPermissions={['public_profile']}
            onLoginFinished={(error, result) => {
              if (error) {
                alert('login has error: ' + result.error);
              } else if (result.isCancelled) {
                alert('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  loginStore.loginWithAccessToken(data.accessToken);
                });
              }
            }}
          />
        </View>
      );
    }
  }
}
