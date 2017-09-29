/**
 * @flow  
 */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import firebase from 'react-native-firebase';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

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

@inject('rootStore')
@observer
export default class LoginContainer extends Component<Props, State> {
  static navigationOptions = {
    headerMode: 'none'
  };
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.rootStore.loginStore.firebaseUser === null) {
      console.log('firebaseuser was null');
      //this.props.loginStore.authenticate();
    }
  }
  componentDidUpdate() {
    if (this.props.rootStore.loginStore.firebaseUser) {
      this.props.navigation.navigate('Main');
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const hasChanges = [
      nextProps.rootStore.loginStore.accessToken !==
        this.props.rootStore.loginStore.accessToken,
      nextProps.rootStore.loginStore.firebaseUser !==
        this.props.rootStore.loginStore.firebaseUser
    ];

    console.log(hasChanges);

    return hasChanges.map(item => item);
  }
  render() {
    const { loginStore } = this.props.rootStore;
    if (loginStore.firebaseUser) {
      return <View />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ padding: 4, fontSize: 28 }}> Hotel relief</Text>
          <FBLogin
            styles={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }}
            permissions={['public_profile']}
            onLogin={data => {
              loginStore.authWithFb(data);
            }}
            onLogout={() => loginStore.logout()}
            onLoginFound={data => {
              loginStore.authWithFb(data);
            }}
            onError={error => console.error('FBERROR', error)}
          />
        </View>
      );
    }
  }
}
