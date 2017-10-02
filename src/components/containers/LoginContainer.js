/**
 * @flow  
 */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Platform, Dimensions } from 'react-native';
import { inject, observer } from 'mobx-react';
import firebase from 'react-native-firebase';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import colors from './../../constants/colors';

type State = {
  isLoggedIn: boolean,
  currentToken: ?AccessToken
};

@inject('rootStore')
@observer
export default class LoginContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
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

    return hasChanges.some(item => item);
  }
  renderLogin() {
    return Platform.OS === 'android' ? (
      <View style={styles.fbContainerAndroid}>
        <FBLogin
          style={styles.fbloginAndroid}
          permissions={['public_profile']}
          onLogin={data => {
            this.props.rootStore.loginStore.authWithFb(data);
          }}
          onLogout={() => this.props.rootStore.loginStore.logout()}
          onLoginFound={data => {
            this.props.rootStore.loginStore.authWithFb(data);
          }}
          onError={error => console.error('FBERROR', error)}
        />
      </View>
    ) : (
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
          this.props.rootStore.loginStore.authWithFb(data);
        }}
        onLogout={() => this.props.rootStore.loginStore.logout()}
        onLoginFound={data => {
          this.props.rootStore.loginStore.authWithFb(data);
        }}
        onError={error => console.error('FBERROR', error)}
      />
    );
  }
  render() {
    if (this.props.rootStore.loginStore.firebaseUser) {
      return <View />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ padding: 4, fontSize: 28, color: colors.pureBlack }}>
            Hotel Relief
          </Text>
          {this.renderLogin()}
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fbloginIOS: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  fbloginAndroid: {
    height: 600,
    marginBottom: 20
  },
  fbContainerIOS: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  fbContainerAndroid: {
    height: Dimensions.get('window').height * 0.08,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
