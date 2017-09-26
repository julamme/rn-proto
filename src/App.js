/**
 * @flow
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { observer, Provider } from 'mobx-react';
import { addNavigationHelpers } from 'react-navigation';
import NavigationStore, { AppNavigator } from './stores/NavigationStore';

type Props = {};

@observer
class App extends Component {
  constructor(props: Props, context: any) {
    super(props);
    this.store = new NavigationStore();
  }
  store: NavigationStore;
  render() {
    console.log('render');
    return (
      <Provider>
        <AppNavigator
          navigation={addNavigationHelpers({
            dispatch: this.store.dispatch,
            state: this.store.navigationState
          })}
        />
      </Provider>
    );
  }
}

export default App;
