import { observable, action } from 'mobx';
import { StackNavigator } from 'react-navigation';
import MainContainer from '../components/containers/MainContainer';
import ProfileContainer from '../components/containers/ProfileContainer';
import LoginContainer from '../components/containers/LoginContainer';
import PlaceContainer from '../components/containers/PlaceContainer';
import NewPlaceContainer from '../components/containers/NewPlaceContainer';

export const AppNavigator = StackNavigator(
  {
    Login: {
      screen: LoginContainer
    },
    Main: {
      screen: MainContainer
    },
    NewPlace: {
      screen: NewPlaceContainer
    },
    Profile: {
      screen: ProfileContainer
    },
    PlaceDetails: {
      screen: PlaceContainer
    }
  },
  {
    initialRouteName: {
      screen: LoginContainer
    },
    headerMode: 'none'
  }
);
export default class NavigationStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable headerTitle = 'Main';
  @observable.ref
  navigationState = {
    index: 0,
    routes: [{ key: 'Login', routeName: 'Login', params: { title: 'Login' } }]
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
