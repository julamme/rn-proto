import React, { Component } from 'react';
import Provider from 'mobx-react';
import { observer} from 'mobx';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import MainContainer from './components/containers/MainContainer';
import ProfileContainer from './components/containers/ProfileContainer';
import LocationContainer from './components/containers/LocationContainer';

export const AppNavigator = StackNavigator({
  Main: {
    screen: MainContainer
  },
  Profile: {
    screen: ProfileContainer
  },
  Location: {
    screen: LocationContainer
  },
  initialRouteName: 'Main'
});

const initialState = AppNavigator.router.getStateForAction();

@observer
class App extends Component {
  constructor(props: Props, context: any) {}
  render() {
    <Provider>
      <AppNavigator />
    </Provider>;
  }
}
