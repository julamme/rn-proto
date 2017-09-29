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
    navigationOptions: ({ navigation: { state } }) => ({
      title: state.params && state.params.title
    })
  }
);
export default class NavigationStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.navigationState = AppNavigator.router.getStateForAction(
      AppNavigator.router.getActionForPathAndParams('Login')
    );
    console.log('initial nav state');
    console.log(this.navigationState);
  }
  @observable headerTitle = 'Main';
  @observable.ref navigationState = null;

  @action
  dispatch = (action, stackNavState = true) => {
    console.log('disp');
    console.log(action);
    console.log(stackNavState);
    console.log(this.navigationState);
    const previousNavState = stackNavState ? this.navigationState : null;
    const nextState = AppNavigator.router.getStateForAction(
      action,
      this.navigationState
    );
    return nextState || previousNavState;
  };
}
