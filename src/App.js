/**
 * @flow
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { observer, Provider } from 'mobx-react';
import { addNavigationHelpers } from 'react-navigation';
import NavigationStore, { AppNavigator } from './stores/NavigationStore';
import LoginStore from './stores/LoginStore';

type Props = {
  navStore: NavigationStore,
  loginStore: LoginStore
};

@observer
class App extends Component {
  constructor(props: Props, context: any) {
    super(props);
    this.navStore = new NavigationStore();
    this.loginStore = new LoginStore();
  }
  navStore: NavigationStore;
  loginStore: LoginStore;
  render() {
    return (
      <Provider navStore={this.navStore} loginStore={this.loginStore}>
        <AppNavigator
          navigation={addNavigationHelpers({
            dispatch: this.navStore.dispatch,
            state: this.navStore.navigationState
          })}
        />
      </Provider>
    );
  }
}

export default App;
