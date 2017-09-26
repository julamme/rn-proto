import { observable, action } from 'mobx';
import { StackNavigator } from 'react-navigation';
import MainContainer from '../components/containers/MainContainer';
import ProfileContainer from '../components/containers/ProfileContainer';
import LocationContainer from '../components/containers/LocationContainer';

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
  initialRouteName: {
    screen: MainContainer
  }
});
export default class NavigationStore {
  @observable headerTitle = 'Main';
  @observable.ref
  navigationState = {
    index: 0,
    routes: [{ key: 'Main', routeName: 'Main', params: { title: 'Main' } }]
  };

  @action
  dispatch = (action, stackNavState = true) => {
    console.log('disp');
    const previousNavState = stackNavState ? this.navigationState : null;
    return (this.navigationState = AppNavigator.router.getStateForAction(
      action,
      previousNavState
    ));
  };
}
