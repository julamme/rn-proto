/**
 * @flow
 */
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { observer, Provider } from 'mobx-react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import RootStore from './stores/RootStore';
import LoginContainer from './components/containers/LoginContainer';
import AppStack from './components/AppStack';

type Props = {
  rootStore: RootStore
};

@observer
class App extends Component {
  constructor(props: Props, context: any) {
    super(props);
    this.rootStore = new RootStore();
  }

  rootStore: RootStore;

  render() {
    return (
      <Provider rootStore={this.rootStore}>
        {this.rootStore.loginStore.firebaseUser === 'debug' ? (
          <AppStack />
        ) : (
          <LoginContainer />
        )}
      </Provider>
    );
  }
}

export default App;
