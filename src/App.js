/**
 * @flow
 */
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { observer, Provider } from 'mobx-react';
import { addNavigationHelpers } from 'react-navigation';
import { AppNavigator } from './stores/NavigationStore';
import RootStore from './stores/RootStore';

type Props = {
  rootStore: RootStore
};

@observer
class App extends Component {
  constructor(props: Props, context: any) {
    super(props);
    this.rootStore = new RootStore();
  }
  navStore: NavigationStore;
  loginStore: LoginStore;
  placeStore: PlaceStore;

  render() {
    return (
      <Provider rootStore={this.rootStore}>
        <AppNavigator
          navigation={addNavigationHelpers({
            dispatch: this.rootStore.navStore.dispatch,
            state: this.rootStore.navStore.navigationState
          })}
        />
      </Provider>
    );
  }
}

export default App;
