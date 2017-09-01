import { observable, action } from 'mobx';
import AppNavigator from '../AppNavigator';

class NavigationStore {
  @observable headerTitle = 'Home'
  @observable.ref navigationState = {
    index: 0,
    routes: [
      {
        key: 'Home',
        routeName: 'Home',
        params: { title: 'Home' },
      },
    ],
  }

  // NOTE: the second param, is to avoid stacking and reset the nav state
  @action dispatch = (actionToRun, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null;
    this.navigationState = AppNavigator
      .router
      .getStateForAction(action, previousNavState);
    return this.navigationState;
  }
}

export default NavigationStore;

